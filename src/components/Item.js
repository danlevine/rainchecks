import _ from "lodash";
import React, { Component } from "react";
import PosterImageLoader from "./PosterImageLoader";

class Item extends Component {
  constructor() {
    super();
    this.state = {
      itemExpanded: false
    };
    this.toggleExpandState = this.toggleExpandState.bind(this);
  }

  toggleExpandState() {
    this.setState({ itemExpanded: !this.state.itemExpanded });
  }

  render() {
    const {
      onDeleteClick,
      onArchiveClick,
      onUnarchiveClick,
      status,
      name,
      releaseDate,
      rated,
      runtime,
      genres,
      director,
      actors,
      cast,
      crew,
      overview,
      country,
      awards,
      imagePosterPath,
      scoreMetacritic,
      scoreImdb,
      scoreTomato,
      scoreTomatoUser,
      tomatoConsensus
    } = this.props;

    const genreStr = genres ? genres.map(x => x.name).join(", ") : "";
    const releaseDateStr = releaseDate ? releaseDate.substr(0, 4) : "";
    const castStr = cast
      ? cast
          .slice(0, 3)
          .map(x => x.name)
          .join(", ")
      : "";
    const directorStr = crew
      ? crew.filter(x => x.job === "Director")[0].name
      : "";
    const expandedClassStr = this.state.itemExpanded
      ? " item-expanded"
      : " item-collapsed";
    const moreInfoBtnTxt = this.state.itemExpanded ? "Hide" : "Show";

    return (
      <li
        className={`item${expandedClassStr}`}
        onClick={this.toggleExpandState}
      >
        <PosterImageLoader
          className="item__poster"
          src={`https://image.tmdb.org/t/p/w342${imagePosterPath}`}
          alt={`${name} movie poster`}
        />
        <div className="item__info-block">
          <div className="item__label">
            <h2 className="item__name">{name}</h2>
            <p className="item__genre">{genreStr}</p>
            <p className="item__tech-info">
              {releaseDateStr} &middot; {runtime} min
            </p>
          </div>
          <ul className="item__scores">
            {!scoreTomato || scoreTomato === "N/A" ? null : (
              <li className="item__score-tomato">
                {scoreTomato}
                <span className="item__score-percent">%</span>
              </li>
            )}
            {!scoreTomatoUser || scoreTomatoUser === "N/A" ? null : (
              <li className="item__score-tomato-user">
                {scoreTomatoUser}
                <span className="item__score-percent">%</span>
              </li>
            )}
            {!scoreImdb || scoreImdb === "N/A" ? null : (
              <li className="item__score-imdb">{scoreImdb}</li>
            )}
            {!scoreMetacritic || scoreMetacritic === "N/A" ? null : (
              <li className="item__score-metacritic">{scoreMetacritic}</li>
            )}
          </ul>
          <div className="item__description">
            <p className="item__plot">{overview}</p>
            <p className="item__people">
              Cast: {castStr}
              <br />
              Director: {directorStr}
            </p>
          </div>
          <div className="item__footer">
            <button
              className="item__btn-delete item__footer-btn"
              onClick={onDeleteClick}
            >
              Delete Movie
            </button>
            {status === "active" ? (
              <button
                className="item__btn-delete item__footer-btn"
                onClick={onArchiveClick}
              >
                Archive Movie
              </button>
            ) : (
              <button
                className="item__btn-delete item__footer-btn"
                onClick={onUnarchiveClick}
              >
                Unarchive Movie
              </button>
            )}
            <button
              className="item__btn-moreinfo item__footer-btn"
              onClick={this.toggleExpandState}
            >{`${moreInfoBtnTxt} Details`}</button>
          </div>
        </div>
      </li>
    );
  }
}

export default Item;
