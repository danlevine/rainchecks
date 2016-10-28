import React, { Component } from 'react';

class Item extends Component {
  constructor() {
    super();
    this.state = {
      itemExpanded: false
    };
    this.toggleExpandState = this.toggleExpandState.bind(this);
  }
  toggleExpandState() {
    this.setState({itemExpanded: !this.state.itemExpanded});
  }

  render() {
    const { onDeleteClick,
            name,
            year,
            rated,
            runtime,
            genre,
            director,
            actors,
            description,
            country,
            awards,
            poster,
            scoreMetacritic,
            scoreImdb,
            scoreTomato,
            scoreTomatoUser,
            tomatoConsensus } = this.props;
    const expandedClassString = this.state.itemExpanded ? ' item-expanded' : ' item-collapsed';
    const moreInfoBtnTxt = this.state.itemExpanded ? 'Hide' : 'Show';
    return (
      <li className={`item${expandedClassString}`}>
        <img className="item__poster" src={poster} alt={`${name} movie poster`} />
        <div className="item__info-block">
          <div className="item__label">
            <h2 className="item__name">{name}</h2>
            <p className="item__genre">{genre}</p>
            <p className="item__tech-info">{`${year} ${rated} ${runtime}`}</p>
          </div>
          <ul className="item__scores">
            { scoreTomato === 'N/A' ? null :
              <li className="item__score-tomato">{scoreTomato}</li>
            }
            { scoreTomatoUser === 'N/A' ? null :
              <li className="item__score-tomato-user">{scoreTomatoUser}%</li>
            }
            { scoreImdb === 'N/A' ? null :
              <li className="item__score-imdb">{scoreImdb}</li>
            }
            { scoreMetacritic === 'N/A' ? null :
              <li className="item__score-metacritic">{scoreMetacritic}</li>
            }
          </ul>
          <div className="item__description">
            <p className="item__plot">{description}</p>
            <p className="item__people">
              Starring: {actors}
              <br/>
              Director: {director}
            </p>
          </div>
          <div className="item__footer">
            <button className="item__btn-delete item__footer-btn" onClick={onDeleteClick}>Delete Movie</button>
            <button className="item__btn-moreinfo item__footer-btn" onClick={this.toggleExpandState}>{`${moreInfoBtnTxt} Details`}</button>
          </div>
        </div>
      </li>
    );
  }
}

export default Item;