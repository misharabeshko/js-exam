document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "1cda8a09d3a84a62ba634379f62c1870";
    const newsContainer = document.getElementById("news-container");
    const fetchNewsButton = document.getElementById("fetch-news");
    const countryCodeInput = document.getElementById("country-code");

    const pagesContainer = document.getElementById("pagesContainer");
    const backButton = document.getElementById("back");
    const nextButton = document.getElementById("next");
    const pages = document.getElementById("pages");


    pagesContainer.style.display = "none";

    let currentPage = 1;
    const pageSize = 12;
    let totalPages = 0;


    const savedCountryCode = getCountryCookie("countryCode");
    if (savedCountryCode) {
        countryCodeInput.value = savedCountryCode;
        fetchNews(savedCountryCode);
    }




    backButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            fetchNews(countryCodeInput.value.trim().toLowerCase());
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchNews(countryCodeInput.value.trim().toLowerCase());
        }
    });


    fetchNewsButton.addEventListener("click", () => {
        const countryCode = countryCodeInput.value.trim().toLowerCase();

        if (countryCode) {
            setCountryCookie(countryCode, 7);
            currentPage = 1;
            fetchNews(countryCode);
        } else {
            alert("Введіть код країни !!!");
        }

    });




    async function fetchNews(countryCode) {
        try {
            const response = await fetch(`https://newsapi.org/v2/top-headlines?country=${countryCode}&page=${currentPage}&pageSize=${pageSize}&apiKey=${apiKey}`);
            const data = await response.json();

            if (data.status === "ok") {
                totalPages = Math.ceil(data.totalResults / pageSize);
                displayNews(data.articles);
                displayPaginationControls(totalPages);
                pagesContainer.style.display = "flex";
            } else {
                alert("Не вдалося отримати новини. Спробуйте ще раз.");
            }

        } catch (error) {
            console.error(`Error fetching news: ${error}`);
            alert("Сталася помилка при отриманні новин.");
        }
    }


    function displayNews(articles) {
        newsContainer.innerHTML = "";

        articles.forEach(article => {
            const newsItem = document.createElement("div");
            newsItem.classList.add("news-item");

            newsItem.innerHTML = `
                <img src="${article.urlToImage || 'images/default-image.jpg'}" alt="News Image">
                <div class="news-item-content">
                    <h2 class="news-item-title">${article.title}</h2>
                    <p class="news-item-description">${article.description || ''}</p>
                    <p class="news-item-date">${new Date(article.publishedAt).toLocaleDateString()}</p>
                    <a href="${article.url}" target="_blank" class="news-item-button">Читати більше</a>
                </div>
            `;

            newsContainer.appendChild(newsItem);
        });
    }





    function setCountryCookie(countryCode) {
        const date = new Date();
        date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = `countryCode=${countryCode};${expires};path=/`;
    }


    function getCountryCookie() {
        const name = "countryCode=";
        const ca = document.cookie.split(";");
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return null;
    }




    function displayPaginationControls(totalPages) {
        pages.innerHTML = "";

        const maxButtons = 7;

        if (totalPages <= maxButtons) {
            for (let i = 1; i <= totalPages; i++) {
                addPageButton(i);
            }
        } else {

            addPageButton(1);

            if (currentPage > 4) {
                addEllipsis();
            }
            const startPage = Math.max(2, currentPage - 2);
            const endPage = Math.min(totalPages - 1, currentPage + 2);

            for (let i = startPage; i <= endPage; i++) {
                addPageButton(i);
            }

            if (currentPage < totalPages - 3) {
                addEllipsis();
            }

            addPageButton(totalPages);
        }
    }


    function addPageButton(page) {
        const pageButton = document.createElement("button");
        pageButton.textContent = page;
        pageButton.classList.add("page-button");
        if (page === currentPage) {
            pageButton.classList.add("active");
        }

        pageButton.addEventListener("click", () => {
            currentPage = page;
            fetchNews(countryCodeInput.value.trim().toLowerCase());
        });

        pages.appendChild(pageButton);
    }

    function addEllipsis() {
        const ellipsis = document.createElement("span");
        ellipsis.textContent = "...";
        ellipsis.classList.add("ellipsis");
        pages.appendChild(ellipsis);
    }


});
