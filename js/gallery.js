document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "EfeFa62BcbfT1iqjV9aA3sDW3K9j0y3AJmWzyze6WepiXQJFsIzj2BBe";
    const pagesContainer = document.getElementById("pagesContainer");

    const fetchImagesButton = document.getElementById("fetch-images");

    const categoryInput = document.getElementById("category");

    const backButton = document.getElementById("back");
    const nextButton = document.getElementById("next");
    const pages = document.getElementById("pages");



    pagesContainer.style.display = "none";

    let currentPage = 1;
    const maxImagesPerPage = 30;
    let totalResults = 0;



    fetchImagesButton.addEventListener("click", () => {
        const category = categoryInput.value.trim().toLowerCase();

        if (category) {
            fetchImages(category);

        } else {
            alert("Введіть категорію !!!");
        }

    });





    async function fetchImages(category) {
        const url = `https://api.pexels.com/v1/search?query=${category}&per_page=${maxImagesPerPage}&page=${currentPage}`;

        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: apiKey
                }
            });
            const data = await response.json();

            totalResults = data.total_results;

            displayImages(data.photos);
            displayPaginationControls(data.total_results);

            pagesContainer.style.display = "flex";

        } catch (error) {
            console.error("Error fetching images:", error);
            alert("Не вдалося отримати зображення. Спробуйте ще раз.");
        }
    }

    function displayImages(photos) {
        const gallery = document.getElementById("gallery");
        gallery.innerHTML = "";

        photos.forEach(photo => {
            const img = document.createElement("img");
            img.src = photo.src.medium;
            img.alt = photo.photographer;

            const div = document.createElement("div");
            div.className = "image";
            div.appendChild(img);

            gallery.appendChild(div);
        });
    }

    function displayPaginationControls(totalResults) {
        pages.innerHTML = "";
        const totalPages = Math.ceil(totalResults / maxImagesPerPage);

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
            fetchImages(categoryInput.value.trim().toLowerCase());
        });

        pages.appendChild(pageButton);
    }

    function addEllipsis() {
        const ellipsis = document.createElement("span");
        ellipsis.textContent = "...";
        ellipsis.classList.add("ellipsis");
        pages.appendChild(ellipsis);
    }


    backButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            fetchImages(categoryInput.value.trim().toLowerCase());
        }
    });

    nextButton.addEventListener("click", () => {
        const totalPages = Math.ceil(totalResults / maxImagesPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            fetchImages(categoryInput.value.trim().toLowerCase());
        }
    });


});
