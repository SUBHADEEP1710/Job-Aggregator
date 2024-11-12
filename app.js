let currentPage = 1;
const resultsPerPage = 10; // Display 10 jobs per page

async function fetchData(query) {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://jsearch.p.rapidapi.com/search?query=${encodedQuery}&page=1&num_pages=5`; // fetch up to 5 pages
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '596c4718f5mshe15a32519b44d54p1b9e49jsnd2295ffb7a7f',
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
    };

    try {
        showLoader(true);
        const response = await fetch(url, options);
        const data = await response.json();
        displayResults(data.data);
    } catch (error) {
        console.error(error);
        document.getElementById("results").textContent = "An error occurred. Please try again.";
    } finally {
        showLoader(false);
    }
}

function displayResults(jobs) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (jobs && jobs.length > 0) {
        const start = (currentPage - 1) * resultsPerPage;
        const end = start + resultsPerPage;
        const jobsToDisplay = jobs.slice(start, end); // Only display jobs for the current page

        const table = document.createElement("table");
        const headerRow = table.insertRow();
        const headers = ["JOB TITLE", "COMPANY", "LOCATION", "LINK", "SITE"];

        headers.forEach(headerText => {
            const header = document.createElement("th");
            header.textContent = headerText;
            headerRow.appendChild(header);
        });

        jobsToDisplay.forEach(job => {
            const row = table.insertRow();
            const titleCell = row.insertCell();
            const employerCell = row.insertCell();
            const locationCell = row.insertCell();
            const applyLinkCell = row.insertCell();
            const siteCell = row.insertCell();

            titleCell.textContent = job.job_title || "N/A";
            employerCell.textContent = job.employer_name || "N/A";
            locationCell.textContent = `${job.job_city || "N/A"}, ${job.job_state || "N/A"}, ${job.job_country || "N/A"}`;
            applyLinkCell.innerHTML = `<a href="${job.job_apply_link}" target="_blank">Apply</a>`;
            siteCell.textContent = job.job_publisher || "N/A";
        });

        resultsDiv.appendChild(table);
        createPagination(jobs);
    } else {
        resultsDiv.textContent = "No results found.";
    }
}

function createPagination(jobs) {
    const paginationDiv = document.createElement("div");
    paginationDiv.classList.add("pagination");

    const totalPages = Math.ceil(jobs.length / resultsPerPage);

    if (totalPages > 1) {
        const prevButton = document.createElement("button");
        prevButton.textContent = "<<";
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                displayResults(jobs);
            }
        });
        paginationDiv.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = i;
            if (i === currentPage) pageButton.classList.add("active");
            pageButton.addEventListener("click", () => {
                currentPage = i;
                displayResults(jobs);
            });
            paginationDiv.appendChild(pageButton);
        }

        const nextButton = document.createElement("button");
        nextButton.textContent = ">>";
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayResults(jobs);
            }
        });
        paginationDiv.appendChild(nextButton);
    }

    const resultsDiv = document.getElementById("results");
    resultsDiv.appendChild(paginationDiv);
}

function showLoader(show) {
    document.getElementById("loader").style.display = show ? "block" : "none";
}

document.getElementById("searchButton").addEventListener("click", () => {
    const query = document.getElementById("searchQuery").value;
    if (query) {
        currentPage = 1; // Reset to first page on new search
        fetchData(query);
    }
});
