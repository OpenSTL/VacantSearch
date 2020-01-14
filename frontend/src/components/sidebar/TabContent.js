import classNames from 'classnames';
import React from 'react';

// props.className = string, custom class name
// props.tabActive = boolean, is tab active or not
export default function TabContent(props) {
  return (
    <div className={classNames('tab-content', props.className, { 'tab-active': props.tabActive })}>
      {props.children}
    </div>
  );
}
