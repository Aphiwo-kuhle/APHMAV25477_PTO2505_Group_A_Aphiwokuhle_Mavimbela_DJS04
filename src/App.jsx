import { useEffect, useState } from "react";
import "./App.css";

/**
 * Main Podcast App
 * Handles fetching data, search, sort, filter and pagination.
 */
function App() {

  // podcast data
  const [podcasts, setPodcasts] = useState([]);

  // loading state
  const [loading, setLoading] = useState(true);

  // UI states
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [genre, setGenre] = useState("all");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const podcastsPerPage = 12;

  /**
   * Fetch podcast data from API
   */
  useEffect(() => {
    async function fetchPodcasts() {
      try {
        const res = await fetch("https://podcast-api.netlify.app");
        const data = await res.json();
        setPodcasts(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch podcasts:", error);
        setLoading(false);
      }
    }

    fetchPodcasts();
  }, []);

  /**
   * Filter podcasts
   */
  const filtered = podcasts.filter((podcast) => {

    const matchesSearch = podcast.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesGenre =
      genre === "all" || podcast.genres.includes(Number(genre));

    return matchesSearch && matchesGenre;
  });

  /**
   * Sort podcasts
   */
  const sorted = filtered.sort((a, b) => {

    if (sort === "newest") {
      return new Date(b.updated) - new Date(a.updated);
    }

    if (sort === "az") {
      return a.title.localeCompare(b.title);
    }

    if (sort === "za") {
      return b.title.localeCompare(a.title);
    }

    return 0;
  });

  /**
   * Pagination logic
   */
  const indexLast = currentPage * podcastsPerPage;
  const indexFirst = indexLast - podcastsPerPage;

  const currentPodcasts = sorted.slice(indexFirst, indexLast);

  const totalPages = Math.ceil(sorted.length / podcastsPerPage);

  return (
    <div className="container">

      <h1 className="title">🎧 Podcast Explorer</h1>

      {/* CONTROLS */}
      <div className="controls">

        <input
          type="text"
          placeholder="Search podcasts..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="az">Title A-Z</option>
          <option value="za">Title Z-A</option>
        </select>

        <select
          value={genre}
          onChange={(e) => {
            setGenre(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All Genres</option>
          <option value="1">Personal Growth</option>
          <option value="2">Investigative</option>
          <option value="3">History</option>
          <option value="4">Comedy</option>
          <option value="5">Entertainment</option>
          <option value="6">Business</option>
          <option value="7">Fiction</option>
          <option value="8">News</option>
          <option value="9">Kids</option>
        </select>

      </div>

      {loading && <p>Loading podcasts...</p>}

      {/* PODCAST GRID */}
      <div className="grid">

        {currentPodcasts.map((podcast) => (
          <div key={podcast.id} className="card">

            <img src={podcast.image} alt={podcast.title} />

            <h3>{podcast.title}</h3>

            <p className="date">
              Updated: {new Date(podcast.updated).toLocaleDateString()}
            </p>

            <p className="seasons">
              Seasons: {podcast.seasons}
            </p>

          </div>
        ))}

      </div>

      {/* PAGINATION */}
      <div className="pagination">

        {Array.from({ length: totalPages }, (_, index) => (

          <button
            key={index}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>

        ))}

      </div>

    </div>
  );
}

export default App;