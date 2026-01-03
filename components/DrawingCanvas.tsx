import React, { useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const CANVAS_WIDTH = width - 40;
const CANVAS_HEIGHT = height * 0.5;

interface Point {
  x: number;
  y: number;
}

interface DrawingPath {
  points: Point[];
  color: string;
  strokeWidth: number;
}

interface DrawingCanvasProps {
  onDrawingChange?: (hasDrawing: boolean) => void;
  color?: string;
  strokeWidth?: number;
  enabled?: boolean;
  clearTrigger?: number;
}

export default function DrawingCanvas({
  onDrawingChange,
  color = '#000000',
  strokeWidth = 4,
  enabled = true,
  clearTrigger = 0,
}: DrawingCanvasProps) {
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  React.useEffect(() => {
    if (clearTrigger > 0) {
      setPaths([]);
      setCurrentPath([]);
      setIsDrawing(false);
      if (onDrawingChange) {
        onDrawingChange(false);
      }
    }
  }, [clearTrigger, onDrawingChange]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => enabled,
      onMoveShouldSetPanResponder: () => enabled,
      onPanResponderGrant: (evt) => {
        if (!enabled) return;
        const { locationX, locationY } = evt.nativeEvent;
        const newPoint = { x: locationX, y: locationY };
        setCurrentPath([newPoint]);
        setIsDrawing(true);
        if (paths.length === 0 && onDrawingChange) {
          onDrawingChange(true);
        }
      },
      onPanResponderMove: (evt) => {
        if (!enabled || !isDrawing) return;
        const { locationX, locationY } = evt.nativeEvent;
        const newPoint = { x: locationX, y: locationY };
        setCurrentPath((prev) => [...prev, newPoint]);
      },
      onPanResponderRelease: () => {
        if (!enabled || !isDrawing) return;
        if (currentPath.length > 0) {
          setPaths((prev) => [
            ...prev,
            {
              points: [...currentPath],
              color,
              strokeWidth,
            },
          ]);
        }
        setCurrentPath([]);
        setIsDrawing(false);
      },
    })
  ).current;

  const pathToSvgPath = (points: Point[]): string => {
    if (points.length === 0) return '';
    if (points.length === 1) {
      return `M ${points[0].x} ${points[0].y} L ${points[0].x} ${points[0].y}`;
    }
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path;
  };


  return (
    <View style={styles.container}>
      <View style={styles.canvas} {...panResponder.panHandlers}>
        <Svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={styles.svg}>
          {paths.map((path, index) => (
            <Path
              key={index}
              d={pathToSvgPath(path.points)}
              stroke={path.color}
              strokeWidth={path.strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {currentPath.length > 0 && (
            <Path
              d={pathToSvgPath(currentPath)}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvas: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  svg: {
    flex: 1,
  },
});

