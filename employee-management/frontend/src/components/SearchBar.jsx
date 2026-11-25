
import {
  Search,
  Filter,
  ArrowUpDown,
  RefreshCw,
  RotateCcw,
  X
} from "lucide-react";

const SearchBar = ({
  search = "",
  setSearch,
  department = "",
  setDepartment,
  sortBy = "createdAt",
  setSortBy,
  order = "desc",
  setOrder,
  departments = [],
  onRefresh,
  loading = false
}) => {
  // Reset all filters to their default values
  const handleReset = () => {
    setSearch("");
    setDepartment("");
    setSortBy("createdAt");
    setOrder("desc");
  };

  // Check whether any filters are active
  const hasActiveFilters =
    search !== "" ||
    department !== "" ||
    sortBy !== "createdAt" ||
    order !== "desc";

  return (
    <div className="search-filter-container">
      {/* Search and filter controls */}
      <div className="search-filter-row">

        {/* Search input */}
        <div className="search-input-wrapper">
          <Search
            size={19}
            className="search-input-icon"
          />

          <input
            type="text"
            className="form-control search-input"
            placeholder="Search by name, department or role..."
            aria-label="Search employees"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Department filter */}
        <div className="filter-control">
          <Filter
            size={17}
            className="filter-icon"
          />

          <select
            className="form-control filter-select"
            value={department}
            aria-label="Filter by department"
            onChange={(e) =>
              setDepartment(e.target.value)
            }
          >
            <option value="">
              All Departments
            </option>

            {departments.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Sort field */}
        <div className="filter-control">
          <ArrowUpDown
            size={17}
            className="filter-icon"
          />

          <select
            className="form-control filter-select"
            value={sortBy}
            aria-label="Sort employees by"
            onChange={(e) =>
              setSortBy(e.target.value)
            }
          >
            <option value="createdAt">
              Date Added
            </option>

            <option value="name">
              Employee Name
            </option>

            <option value="department">
              Department
            </option>

            <option value="role">
              Job Role
            </option>

            <option value="salary">
              Salary
            </option>

            <option value="joinDate">
              Joining Date
            </option>

            <option value="updatedAt">
              Last Updated
            </option>
          </select>
        </div>

        {/* Sorting order */}
        <div className="filter-control">
          <select
            className="form-control sort-order-select"
            value={order}
            aria-label="Sorting order"
            onChange={(e) =>
              setOrder(e.target.value)
            }
          >
            <option value="asc">
              Ascending
            </option>

            <option value="desc">
              Descending
            </option>
          </select>
        </div>

        {/* Refresh button */}
        <button
          type="button"
          className="btn btn-secondary refresh-btn"
          onClick={onRefresh}
          disabled={loading}
          title="Refresh employees"
          aria-label="Refresh employees"
        >
          <RefreshCw
            size={17}
            className={loading ? "rotating" : ""}
          />

          <span>Refresh</span>
        </button>
      </div>

      {/* Active filters section */}
      {hasActiveFilters && (
        <div className="active-filters-row">
          <div className="active-filters">
            <span className="active-filters-label">
              Active filters:
            </span>

            {/* Search filter badge */}
            {search && (
              <span className="filter-badge">
                Search: {search}

                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Remove search filter"
                >
                  <X size={13} />
                </button>
              </span>
            )}

            {/* Department filter badge */}
            {department && (
              <span className="filter-badge">
                {department}

                <button
                  type="button"
                  onClick={() => setDepartment("")}
                  aria-label="Remove department filter"
                >
                  <X size={13} />
                </button>
              </span>
            )}

            {/* Sorting badge */}
            {(sortBy !== "createdAt" ||
              order !== "desc") && (
              <span className="filter-badge">
                Sort: {sortBy} ({order})

                <button
                  type="button"
                  onClick={() => {
                    setSortBy("createdAt");
                    setOrder("desc");
                  }}
                  aria-label="Reset sorting"
                >
                  <X size={13} />
                </button>
              </span>
            )}
          </div>

          {/* Reset all filters */}
          <button
            type="button"
            className="reset-filters-btn"
            onClick={handleReset}
          >
            <RotateCcw size={15} />

            <span>Reset All</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
