import React, { Component } from "react";
import styled from "styled-components";

import PosterImageLoader from "./PosterImageLoader";
import IconTomato from "../assets/icons/tomato.svg";
import IconFlixster from "../assets/icons/flixster.svg";
import IconImdb from "../assets/icons/imdb.svg";
import IconMetacritic from "../assets/icons/metacritic.svg";

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
      runtime,
      genres,
      cast,
      crew,
      overview,
      imagePosterPath,
      scoreMetacritic,
      scoreImdb,
      scoreTomato,
      scoreTomatoUser,
      videos
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

    return (
      <ItemStyled className={expandedClassStr}>
        <button className="item-main" onClick={this.toggleExpandState}>
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
            <div className="item__description">
              <p className="item__plot">{overview}</p>
              <p className="item__people">
                <span className="item__accent-label">Cast</span>
                {castStr}
                <br />
                <span className="item__accent-label">Director</span>
                {directorStr}
              </p>
            </div>
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
          <div className="item__toggle-indicator">
            {this.state.itemExpanded ? (
              <i className="fa fa-chevron-up" />
            ) : (
              <i className="fa fa-chevron-down" />
            )}
          </div>
        </button>
        <div className={`item__slide-down${expandedClassStr}`}>
          <div className="item__slide-down-description">
            <p className="item__plot">{overview}</p>
            <p className="item__people">
              <span className="item__accent-label">Cast</span>
              {castStr}
              <br />
              <span className="item__accent-label">Director</span>
              {directorStr}
            </p>
          </div>
          <div className="item__footer">
            {videos && (
              <a
                className="item__footer-btn"
                target="_blank"
                rel="noopener noreferrer"
                href={`https://youtu.be/${videos.results[0].key}`}
                tabIndex={this.state.itemExpanded ? null : "-1"}
              >
                <i className="fa fa-film" />
                View trailer
              </a>
            )}
            {status === "active" ? (
              <button
                className="item__footer-btn"
                onClick={onArchiveClick}
                disabled={!this.state.itemExpanded}
              >
                <i className="fa fa-eye fa-fw" />
                Mark as watched
              </button>
            ) : (
              <button
                className="item__footer-btn"
                onClick={onUnarchiveClick}
                disabled={!this.state.itemExpanded}
              >
                <i className="fa fa-eye-slash fa-fw" />
                Mark as unwatched
              </button>
            )}
            <button
              className="item__footer-btn"
              onClick={onDeleteClick}
              disabled={!this.state.itemExpanded}
            >
              <i className="fa fa-minus fa-fw" />
              Remove from list
            </button>
          </div>
        </div>
      </ItemStyled>
    );
  }
}

const item_border_radius = 6;
const item_poster_height_small = 150;
const item_poster_width_small = 100;
const item_poster_height_medium = 300;
const item_poster_width_medium = 200;
const break_small = 620;
const default_padding_amount = 16;

const ItemStyled = styled.li`
  margin-bottom: ${default_padding_amount}px;

  &:last-of-type {
    margin-bottom: 0;
  }

  @media (min-width: ${break_small}px) {
    cursor: default;
  }

  .item-main {
    background-color: #fff;
    border-radius: ${item_border_radius}px;
    position: relative;
    min-height: ${item_poster_height_small}px;
    display: flex;
    z-index: 1;
    cursor: pointer;
    padding: 0;
    border: none;
    text-align: left;
    width: 100%;

    &:focus {
      outline: none;
      /* background-color: rgba(255, 255, 255, 0.9); */
    }
  }

  .item__poster {
    height: ${item_poster_height_small}px;
    width: ${item_poster_width_small}px;
    border-radius: ${item_border_radius}px 0 0 ${item_border_radius}px;
    flex-shrink: 0;

    @media (min-width: ${break_small}px) {
      height: ${item_poster_height_medium}px;
      width: ${item_poster_width_medium}px;
    }
  }

  .item__info-block {
    padding: ${default_padding_amount}px;
    font-size: 13px;
    font-weight: 300;
    flex-grow: 1;

    @media (min-width: ${break_small}px) {
      font-size: 11px;
    }
  }

  .item__name {
    font-size: 16px;
    display: inline-block;
    font-weight: 600;
    margin: 0;

    @media (min-width: ${break_small}px) {
      font-size: 18px;
    }
  }

  .item__genre,
  .item__tech-info {
    margin: 0;

    @media (min-width: ${break_small}px) {
      line-height: 1.4;
    }
  }

  .item__scores {
    list-style-type: none;
    text-align: right;
    padding: ${default_padding_amount}px;
    padding-left: 0;
    padding-right: 16px;

    li {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: 12px;

      @media (min-width: ${break_small}px) {
        font-size: 13px;
      }

      &:after {
        content: "";
        margin-left: 2px;
        width: 14px;
        height: 14px;
        background-position: center;
      }
    }
  }

  .item__score-tomato:after {
    background: url(${IconTomato}) no-repeat;
  }
  .item__score-tomato-user:after {
    background: url(${IconFlixster}) no-repeat;
  }
  .item__score-imdb:after {
    background: url(${IconImdb}) no-repeat;
  }
  .item__score-metacritic:after {
    background: url(${IconMetacritic}) no-repeat;
  }

  .item__score-percent {
    font-size: 10px;
  }

  .item__description {
    padding: ${default_padding_amount}px 0;
    display: none;

    @media (min-width: ${break_small}px) {
      display: block;
    }
  }

  .item__plot {
    @media (min-width: ${break_small}px) {
      margin-bottom: 10px;
    }
  }

  .item__footer {
    display: flex;
    width: 100%;
    margin-top: 5px;
  }

  .item__footer-btn {
    color: #fff;
    background: none;
    border: none;
    line-height: 28px;
    padding: 16px;
    flex: 1;
    line-height: 1.4;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    text-align: center;
    transition: 0.2s background-color ease-out;
    cursor: pointer;

    @media (min-width: ${break_small}px) {
      padding: 24px 16px;
    }

    &:focus {
      outline: none;
      /* background-color: rgba(255, 255, 255, 0.2); */
    }

    &:hover {
      .fa {
        background-color: rgba(255, 255, 255, 0.5);
      }
    }

    .fa {
      font-size: 24px;
      margin-bottom: 5px;
      background-color: rgba(255, 255, 255, 0.3);
      height: 50px;
      width: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.2s background-color ease-out;
    }
  }

  .item__btn-slide {
    position: absolute;
    bottom: 5px;
    right: 5px;
  }

  .item__slide-down {
    position: relative;
    background: #3192bd; /* alternate darker blue */
    color: #fff;
    font-size: 16px;
    border-radius: 0 0 6px 6px;
    margin-top: -5px;
    max-height: 700px;
    overflow: hidden;
    transition: 0.4s all ease-out;

    &.item-collapsed {
      max-height: 0;
    }

    @media (min-width: ${break_small}px) {
      max-height: 150px;
    }
  }

  .item__slide-down-description {
    padding: 15px 15px 0;

    @media (min-width: ${break_small}px) {
      display: none;
    }
  }

  .item__toggle-indicator {
    position: absolute;
    bottom: 7px;
    right: 10px;
    color: #999;
    font-size: 12px;
  }

  .item__people {
    margin-top: 16px;
  }

  .item__accent-label {
    text-transform: uppercase;
    background: white;
    color: #3192bd; /* alternate darker blue, todo: move to globals */
    font-size: 10px;
    padding: 0 2px;
    border-radius: 4px;
    margin-right: 5px;
    position: relative;
    top: -2px;

    @media (min-width: ${break_small}px) {
      color: #fff;
      background: #999;
      font-size: 8px;
      top: -1px;
    }
  }
`;

export default Item;
