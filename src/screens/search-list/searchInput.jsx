import React, { useState } from "react";
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import { withApollo } from "react-apollo";
import UserUtils from '../../utilities/userUtils';

const SearchInput = (props) => {

  const [searchAuthors, setSearchAuthors] = useState('');

  const handleSearch = (e) => {
    setSearchAuthors(e.target.value);
    // if (e.target.value.length >= 3) {
    //   UserUtils.setSearchKeyword(searchAuthors);
    //   props.history.push('/search');
    // }
  }

  const sumbitSearch = (e) => {
    e.preventDefault();
    UserUtils.setSearchKeyword(searchAuthors);
    props.history.push('/search');
    setTimeout(() => {
      setSearchAuthors('');
    }, 2000);

  }

  return (
    <div className="search-row">
      <form name="searchAuthor" onSubmit={sumbitSearch} autoComplete="off">
        <input
          type="search"
          placeholder="Search..."
          name="searchAuthors"
          value={searchAuthors}
          onChange={handleSearch}
        ></input>
        <span className="search-btn"><i className="fa fa-search"></i></span>
      </form>
    </div>
  );
};

const enhance = compose(
  withRouter,
  withApollo
);
export default enhance(SearchInput);
