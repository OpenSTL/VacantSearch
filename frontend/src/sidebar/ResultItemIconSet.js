import classNames from 'classnames';
import React, { Component } from 'react';

/**
 * prop: resultItem
 * 
 * icon(s) that accompany each search result
 * icons depend on lot type (building, lot, other)
 * if 'vacant building', it's a building icon
 * if 'vacant lot', it's a seedling icon
 * otherwise it's a question mark icon
 * however... if the word "Possible" is at the front of the lot type...
 * we will get a second question mark icon that appears after the first.
 * Example. "Possible Vacant Building" gets two icons: a building and a question.
 * Example. "Vacant Lot" gets one icon: a seedling
 */
class ResultItemIconSet extends Component {
  render() {
    let lotType = this.props.resultItem.lot_type;
    const isPossibleType = lotType.startsWith('Possible');
    if (isPossibleType) {
      // if this is a possible type ex. 'Possible Vacant Lot',
      // remove 'Possible' from the string so we can evaluate
      // the lot type by itself
      lotType = lotType.split(' ').slice(1).join(' ');
    }
    // Determine icon from lot type
    let resultTypeIcon = '';
    switch (lotType) {
      case 'Vacant Building':
        resultTypeIcon = 'fa-building';
        break;
      case 'Vacant Lot':
        resultTypeIcon = 'fa-seedling';
        break;
      default:
        resultTypeIcon = 'fa-question';
    }
    const resultItemIconCx = classNames('fa', resultTypeIcon, 'results-item-icon');

    return (
      <>
        <i className={resultItemIconCx} />
        {isPossibleType && <i className='fa fa-question results-item-icon' />}
      </>
    );
  }
}
export default ResultItemIconSet;
