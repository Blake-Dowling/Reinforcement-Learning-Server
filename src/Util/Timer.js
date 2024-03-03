import React, { useState, useEffect } from 'react';

export default function TimerComponent(props){

  const handleTick = () => {
    props.setTicks((prevTicks) => prevTicks + 1);
  };

  useEffect(() => {
    const timerId = setInterval(handleTick, props.speed); 
    return () => {
      clearInterval(timerId);
    };
  }, [props.speed]); 

  return (
    <div>
      <p>Ticks: {props.ticks}</p>
    </div>
  );
};


