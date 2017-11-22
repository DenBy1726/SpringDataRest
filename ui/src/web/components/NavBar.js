import React from "react"
import propTypes from "prop-types"

export default class NavBar extends React.Component{
    constructor(props){
        super(props);

        this.handleNavFirst = this.handleNavFirst.bind(this);
        this.handleNavPrev = this.handleNavPrev.bind(this);
        this.handleNavNext = this.handleNavNext.bind(this);
        this.handleNavLast = this.handleNavLast.bind(this);
        this.handlePageSize = this.handlePageSize.bind(this);
    }

    handleNavFirst(e){
        this.props.onNavigate(this.props.links.first.href,this.props.attributes);
    }

    handleNavPrev(e) {
        this.props.onNavigate(this.props.links.prev.href,this.props.attributes);
    }

    handleNavNext(e) {
        this.props.onNavigate(this.props.links.next.href,this.props.attributes);
    }

    handleNavLast(e) {
        this.props.onNavigate(this.props.links.last.href,this.props.attributes);
    }

    handlePageSize(){
        let input = this.refs.pageSizeInput.value;
        if(input !== "")
            this.props.changePageSize(input);
    }

    render(){
        let navLinks = [];
        if ("first" in this.props.links) {
            navLinks.push(<a key="first" onClick={this.handleNavFirst} className="fa fa-angle-double-left"/>);
        }
        if ("prev" in this.props.links) {
            navLinks.push(<a key="prev" onClick={this.handleNavPrev} className="fa fa-angle-left"/>);
        }
        if ("next" in this.props.links) {
            navLinks.push(<a key="next" onClick={this.handleNavNext} className="fa fa-angle-right"/>);
        }
        if ("last" in this.props.links) {
            navLinks.push(<a key="last" onClick={this.handleNavLast} className="fa fa-angle-double-right"/>);
        }
        return <div className="paginationTab">
            <div className="paginator">
                {navLinks}
            </div>
            <div>
                <a className="paginationInfo">Всего записей {this.props.page.totalElements}</a>
                <a className="paginationInfo">Страница {this.props.page.number + 1} из {this.props.page.totalPages}</a>
                <a className="paginationInfo">Размер страницы</a>
                <input id="pageSizeInput" type="number" placeholder={this.props.page.size} ref="pageSizeInput" onBlur={this.handlePageSize}/>
            </div>
        </div>
    }
}

NavBar.propTypes = {
    links : propTypes.object,
    onNavigate : propTypes.func,
    attributes : propTypes.object,
    page : propTypes.object,
    changePageSize : propTypes.func
};