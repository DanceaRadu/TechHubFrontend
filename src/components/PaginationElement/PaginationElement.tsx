import './PaginationElement.css'
import {useNavigate} from "react-router-dom";

function PaginationElement(props:any) {

    const currentPageNumber:number = props.currentPageNumber;
    const totalPagesNumber:number = props.totalPagesNumber;
    const linkBeginning:number = props.linkBeginning;
    const linkEnding:number = props.linkEnding;

    const navigate = useNavigate();
    const pageNumbers:number[] = Array.from({ length: totalPagesNumber }, (_, index) => index + 1)

    function changePage(pageNumber:number) {
        navigate(linkBeginning + "/" + pageNumber + linkEnding);
    }

    return (
        <div id="pagination-element-main-div">
            {pageNumbers.map((page:number) => (
                <button
                    key={page}
                    onClick={() => changePage(page)}
                    className={currentPageNumber == page ? 'pagination-button-active' : 'pagination-button-inactive'}>
                    {page}
                </button>
            ))}
        </div>
    );
}

export default PaginationElement;