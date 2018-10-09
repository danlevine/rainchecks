import React, { Component } from "react";
import _ from "lodash";
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
      tomatoConsensus,
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
    const moreInfoBtnTxt = this.state.itemExpanded ? "Hide" : "Show";

    return (
      <ItemStyled className={expandedClassStr}>
        <div className="item-main" onClick={this.toggleExpandState}>
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
                Cast: {castStr}
                <br />
                Director: {directorStr}
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
          {/* <button
              className="item__btn-slide"
              onClick={this.toggleExpandState}
            >
              More <i className="fa fa-chevron-down" />
            </button> */}
          <div className="item__toggle-indicator">
            {this.state.itemExpanded ? (
              <i className="fa fa-chevron-down" />
            ) : (
              <i className="fa fa-chevron-up" />
            )}
          </div>
        </div>
        <div className={`item__slide-down${expandedClassStr}`}>
          <div className="item__slide-down-description">
            <p className="item__plot">{overview}</p>
            <p className="item__people">
              Cast: {castStr}
              <br />
              Director: {directorStr}
            </p>
          </div>
          <div className="item__footer">
            <button className="item__footer-btn" onClick={onDeleteClick}>
              <i className="fa fa-minus" />
              Remove from list
            </button>
            {status === "active" ? (
              <button className="item__footer-btn" onClick={onArchiveClick}>
                <i className="fa fa-check" />
                Mark as watched
              </button>
            ) : (
              <button className="item__footer-btn" onClick={onUnarchiveClick}>
                <i className="fa fa-exit" />
                Mark as unwatched
              </button>
            )}
            {videos && (
              <a
                className="item__footer-btn"
                target="_blank"
                href={`https://youtu.be/${videos.results[0].key}`}
              >
                <i className="fa fa-camera" />
                View trailer
              </a>
            )}
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
const item_footer_button_height = 32;
const break_small = 620;
const break_before_small = 619;
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
    cursor: pointer;
    display: flex;
    z-index: 1;
  }

  .item__poster {
    height: ${item_poster_height_small}px;
    width: ${item_poster_width_small}px;
    flex-shrink: 0;
    /* min-width: ${item_poster_width_small}px; */
    /* position: absolute; */
    /* top: 0; */
    /* bottom: 0; */
    border-radius: ${item_border_radius}px 0 0 ${item_border_radius}px;

    @media (min-width: ${break_small}px) {
      height: ${item_poster_height_medium}px;
      width: ${item_poster_width_medium}px;
      /* min-width: ${item_poster_width_medium}px; */
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
    font-size: 14px;
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
      font-size: 10px;

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
  }

  .item__footer-btn {
    border: none;
    background: none;
    line-height: 28px;
    cursor: pointer;
    padding: 16px;
    flex: 1;
    line-height: 1.4;
    /* white-space: nowrap; */
    transition: flex 0.2s 0.2s, padding 0.2s 0.2s, border 0.2s 0.2s;
    /* border-right: 1px solid white; */
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;

    /* &:last-of-type {
      border-right: none;
    } */

    &:focus {
      text-decoration: underline;
      outline: none;
    }

    .fa {
      font-size: 24px;
      margin-bottom: 5px;
    }
  }

  .item__btn-slide {
    position: absolute;
    bottom: 5px;
    right: 5px;
  }

  .item__slide-down {
    position: relative;
    background: #3192BD; /* alternate darker blue */
    color: #fff;
    border-radius: 0 0 6px 6px;
    margin-top: -5px;
    max-height: 500px;
    overflow: hidden;
    transition: .4s all ease-out;

    &.item-collapsed {
      max-height: 0;
    }

    @media (min-width: ${break_small}px) {
      max-height: 100px;
    }
  }

  .item__slide-down-description {
    padding: 15px;

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
`;

export default Item;
