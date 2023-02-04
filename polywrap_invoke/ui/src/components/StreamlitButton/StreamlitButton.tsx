import React from 'react';
import './StreamlitButton.css';

interface Props {
  onClick: () => void;
}

const StreamlitButton: React.FC<Props> = (props) => {
  return (
    <button className="streamlit-button" {...props}>
      {props.children}
    </button>
  );
};

export default StreamlitButton;