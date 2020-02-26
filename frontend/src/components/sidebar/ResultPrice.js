import React from 'react';

/**
 * prop: price (number); zero means unlisted
 */
export default function ResultPrice(props) {
  const { price } = props;
  if (price) return (
    <span>{`$${price}`}</span>
  );
  return (
    <span className='price-unlisted'>price unlisted</span>
  );
}