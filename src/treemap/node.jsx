import { h } from "preact";
import { useLayoutEffect, useRef } from "preact/hooks";

const PARENT_PADDING = 4;
const PARENT_TITLE_HEIGHT = 20;

const leafScale = (box, { width, height }) => {
  const scale = Math.min(
    (width * 0.95) / box.width,
    (height * 0.95) / box.height
  );
  return scale;
};

const parentScale = (box, { width, height }) => {
  const scale = Math.min(
    (width - PARENT_PADDING * 2) / box.width,
    (Math.min(height, PARENT_TITLE_HEIGHT) - 5) / box.height
  );
  return scale;
};

const Node = ({
  node,
  backgroundColor,
  fontColor,
  onClick,
  isSelected,
  onNodeHover,
}) => {
  const { x0, x1, y1, y0, data, children = null } = node;

  const isLeaf = children == null;

  const handleClickSelection = (event) => {
    if (window.getSelection().toString() !== "") {
      event.stopPropagation();
    }
  };

  const textRef = useRef();

  const width = x1 - x0;
  const height = y1 - y0;

  const textAttributes = {};
  if (isLeaf) {
    textAttributes["text-anchor"] = "middle";
    textAttributes["dominant-baseline"] = "middle";
  } else {
    textAttributes.x = PARENT_PADDING;
    textAttributes["dominant-baseline"] = "middle";
  }

  const sizeRef = useRef();

  useLayoutEffect(() => {
    if (width == 0 || height == 0) {
      return;
    }

    if (sizeRef.current == null) {
      sizeRef.current = textRef.current.getBoundingClientRect();
    }

    const scale = isLeaf
      ? leafScale(sizeRef.current, { width, height })
      : parentScale(sizeRef.current, { width, height });

    textRef.current.setAttribute("transform", `scale(${scale.toFixed(2)})`);
    if (isLeaf) {
      textRef.current.setAttribute("y", height / 2 / scale);
      textRef.current.setAttribute("x", width / 2 / scale);
    } else {
      textRef.current.setAttribute(
        "y",
        Math.min(PARENT_TITLE_HEIGHT, height) / 2 / scale
      );
    }
  }, [width, height]);

  if (width == 0 || height == 0) {
    return null;
  }

  return (
    <g
      className="node"
      transform={`translate(${x0},${y0})`}
      onClick={onClick}
      onMouseOver={(evt) => {
        evt.stopPropagation();
        onNodeHover(node);
      }}
    >
      <rect
        fill={backgroundColor}
        rx={2}
        ry={2}
        width={width}
        height={height}
        stroke={isSelected ? "#fff" : null}
        strokeWidth={isSelected ? 2 : null}
      ></rect>
      <text
        ref={textRef}
        fill={fontColor}
        onClick={handleClickSelection}
        fontSize="0.7em"
        {...textAttributes}
      >
        {data.name}
      </text>
    </g>
  );
};

export default Node;
