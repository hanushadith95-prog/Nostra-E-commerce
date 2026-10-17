
/* Collections page functionality */

var search = document.getElementById("search");
var productContainer = document.getElementById("productContainer");
var priceFilter = document.getElementById("priceFilter");
var sortFilter = document.getElementById("sortFilter");
var clearFilters = document.getElementById("clearFilters");
var resultCount = document.getElementById("resultCount");
var noProducts = document.getElementById("noProducts");

if (productContainer) {
    var products = productContainer.querySelectorAll(".product-card");
    var categoryFilters = document.querySelectorAll(".category-filter");

    // Read the selected category from the home page link
    var params = new URLSearchParams(window.location.search);
    var selectedCategory = params.get("category");

    if (selectedCategory) {
        categoryFilters.forEach(function (checkbox) {
            if (checkbox.value === selectedCategory) {
                checkbox.checked = true;
            }
        });
    }

    function filterProducts() {
        var enteredValue = search.value.toLowerCase();
        var selectedPrice = priceFilter.value;
        var selectedCategories = [];

        categoryFilters.forEach(function (checkbox) {
            if (checkbox.checked) {
                selectedCategories.push(checkbox.value);
            }
        });

        var visibleProducts = [];

        products.forEach(function (product) {
            var productName = product.getAttribute("data-name").toLowerCase();
            var productCategory = product.getAttribute("data-category");
            var productPrice = Number(product.getAttribute("data-price"));

            var matchesSearch =
                productName.includes(enteredValue) ||
                productCategory.toLowerCase().includes(enteredValue);

            var matchesCategory =
                selectedCategories.length === 0 ||
                selectedCategories.includes(productCategory);

            var matchesPrice = true;

            if (selectedPrice !== "all") {
                var priceRange = selectedPrice.split("-");
                var minimum = Number(priceRange[0]);
                var maximum = Number(priceRange[1]);

                if (selectedPrice === "0-1000") {
                    matchesPrice = productPrice < 1000;
                } else if (selectedPrice === "1000-2000") {
                    matchesPrice =
                        productPrice >= minimum &&
                        productPrice <= maximum;
                } else {
                    matchesPrice = productPrice > 2000;
                }
            }

            if (matchesSearch && matchesCategory && matchesPrice) {
                visibleProducts.push(product);
            }
        });

        // Sort the matching products
        var sortValue = sortFilter.value;

        if (sortValue === "low") {
            visibleProducts.sort(function (a, b) {
                return Number(a.getAttribute("data-price")) -
                    Number(b.getAttribute("data-price"));
            });
        } else if (sortValue === "high") {
            visibleProducts.sort(function (a, b) {
                return Number(b.getAttribute("data-price")) -
                    Number(a.getAttribute("data-price"));
            });
        } else if (sortValue === "name") {
            visibleProducts.sort(function (a, b) {
                return a.getAttribute("data-name").localeCompare(
                    b.getAttribute("data-name")
                );
            });
        }

        // Display the matching products
        products.forEach(function (product) {
            product.style.display = "none";
        });

        visibleProducts.forEach(function (product) {
            product.style.display = "block";
            productContainer.appendChild(product);
        });

        resultCount.textContent =
            "Showing " + visibleProducts.length + " products";

        if (visibleProducts.length === 0) {
            noProducts.style.display = "block";
        } else {
            noProducts.style.display = "none";
        }
    }

    // Search as the user types
    search.addEventListener("input", filterProducts);

    // Apply filters when changed
    categoryFilters.forEach(function (checkbox) {
        checkbox.addEventListener("change", filterProducts);
    });

    priceFilter.addEventListener("change", filterProducts);
    sortFilter.addEventListener("change", filterProducts);

    // Clear all filters
    clearFilters.addEventListener("click", function () {
        search.value = "";
        priceFilter.value = "all";
        sortFilter.value = "default";

        categoryFilters.forEach(function (checkbox) {
            checkbox.checked = false;
        });

        filterProducts();
    });

    // Show all products initially, applying any URL category
    filterProducts();
}


/* Contact form functionality */

var contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        var name = document.getElementById("name").value.trim();
        var formMessage = document.getElementById("formMessage");

        formMessage.textContent =
            "Thank you, " + name + "! Your message has been received.";

        contactForm.reset();
    });
}
