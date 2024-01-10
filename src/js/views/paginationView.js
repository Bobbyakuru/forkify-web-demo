import icons from 'url:../../img/icons.svg';
import View from "./view";

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addHanderClick(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.btn--inline')
            if (!btn) return;

            const goToPage = +btn.dataset.goto;

            handler(goToPage);
        })
    }

    _generateMarkup() {
        const curpage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);

        // Page 1,  and there are other pages
        if (curpage === 1 && numPages > 1) {
            return `
                    <button data-goto="${curpage + 1}"  class="btn--inline pagination__btn--next">
                        <span>Page ${curpage + 1}</span>
                            <svg class="search__icon">
                                <use href="${icons}#icon-arrow-right"></use>
                            </svg>
                    </button>
            `;
        }

        // Last page
        if (curpage === numPages && numPages > 1) {
            return `
                    <button data-goto="${curpage - 1}" class="btn--inline pagination__btn--prev">
                        <svg class="search__icon">
                            <use href="${icons}#icon-arrow-left"></use>
                        </svg>
                            <span>Page ${curpage - 1}</span>
                    </button>
            `;
        }

        // Other page
        if (curpage < numPages) {
            return `
                    <button data-goto="${curpage - 1}" class="btn--inline pagination__btn--prev">
                        <svg class="search__icon">
                            <use href="${icons}#icon-arrow-left"></use>
                        </svg>
                            <span>Page ${curpage - 1}</span>
                    </button> 
                    <button data-goto="${curpage + 1}" class="btn--inline pagination__btn--next">
                        <span>Page ${curpage + 1}</span>
                            <svg class="search__icon">
                                <use href="${icons}#icon-arrow-right"></use>
                            </svg>
                    </button>
            `;
        }

        // page 1, and there are No other pages
        return '';
    }
}

export default new PaginationView();