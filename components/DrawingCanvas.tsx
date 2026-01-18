import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

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
  isEraser?: boolean;
}

interface DrawingCanvasProps {
  onDrawingChange?: (hasDrawing: boolean) => void;
  color?: string;
  strokeWidth?: number;
  enabled?: boolean;
  clearTrigger?: number;
  isEraser?: boolean;
}

export default function DrawingCanvas({
  onDrawingChange,
  color = '#000000',
  strokeWidth = 4,
  enabled = true,
  clearTrigger = 0,
  isEraser = false,
}: DrawingCanvasProps) {
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const isDrawingRef = useRef(false);

  // Use refs to always have current values in callbacks
  const strokeWidthRef = useRef(strokeWidth);
  const colorRef = useRef(color);
  const isEraserRef = useRef(isEraser);
  
  // Update refs immediately when props change (synchronous update)
  strokeWidthRef.current = strokeWidth;
  colorRef.current = color;
  isEraserRef.current = isEraser;

  useEffect(() => {
    if (clearTrigger > 0) {
      setPaths([]);
      setCurrentPath([]);
      isDrawingRef.current = false;
      if (onDrawingChange) {
        onDrawingChange(false);
      }
    }
  }, [clearTrigger, onDrawingChange]);

  // Check if a line segment is within eraser radius of any eraser point
  const isLineSegmentNearEraser = useCallback(
    (p1: Point, p2: Point, eraserPath: Point[], eraserRadius: number): boolean => {
      // Check distance from each eraser point to the line segment
      for (const eraserPoint of eraserPath) {
        // Calculate distance from point to line segment
        const A = eraserPoint.x - p1.x;
        const B = eraserPoint.y - p1.y;
        const C = p2.x - p1.x;
        const D = p2.y - p1.y;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;

        if (lenSq !== 0) param = dot / lenSq;

        let xx: number, yy: number;

        if (param < 0) {
          xx = p1.x;
          yy = p1.y;
        } else if (param > 1) {
          xx = p2.x;
          yy = p2.y;
        } else {
          xx = p1.x + param * C;
          yy = p1.y + param * D;
        }

        const dx = eraserPoint.x - xx;
        const dy = eraserPoint.y - yy;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < eraserRadius) {
          return true;
        }
      }
      return false;
    },
    []
  );


  const finishPath = useCallback(() => {
    // Always use the most current values - refs are updated synchronously on each render
    // But also use props as fallback to ensure we have the latest value
    const currentStrokeWidth = strokeWidthRef.current;
    const currentColor = colorRef.current;
    const currentIsEraser = isEraserRef.current;
    
    setCurrentPath((prev) => {
      if (prev.length === 0) {
        isDrawingRef.current = false;
        return [];
      }

      if (currentIsEraser) {
        // Eraser mode: remove paths that intersect with eraser
        // Use a larger radius for better erasing
        const eraserRadius = Math.max(currentStrokeWidth * 4, 20);
        
        setPaths((existingPaths) => {
          const filteredPaths: DrawingPath[] = [];
          
          for (const path of existingPaths) {
            // Check if any point in this path is within eraser radius
            let shouldKeep = true;
            
            // Check each point in the path (more aggressive erasing)
            for (const pathPoint of path.points) {
              for (const eraserPoint of prev) {
                const dx = pathPoint.x - eraserPoint.x;
                const dy = pathPoint.y - eraserPoint.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < eraserRadius) {
                  shouldKeep = false;
                  break;
                }
              }
              if (!shouldKeep) break;
            }
            
            if (shouldKeep) {
              filteredPaths.push(path);
            }
          }
          
          // Update drawing change notification
          if (onDrawingChange) {
            onDrawingChange(filteredPaths.length > 0);
          }
          
          return filteredPaths;
        });
      } else {
        // Drawing mode: add new path
        // Use the prop directly to ensure we always have the latest color value
        // (refs are updated synchronously, but props are guaranteed to be current)
        const pathToAdd: DrawingPath = {
          points: [...prev],
          color: color || currentColor || '#000000',
          strokeWidth: strokeWidth || currentStrokeWidth || 4,
          isEraser: false,
        };
        
        setPaths((existingPaths) => {
          const newPaths = [...existingPaths, pathToAdd];
          if (onDrawingChange && existingPaths.length === 0) {
            onDrawingChange(true);
          }
          return newPaths;
        });
      }
      
      return [];
    });
    isDrawingRef.current = false;
  }, [color, strokeWidth, isEraser, onDrawingChange, isLineSegmentNearEraser]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => enabled,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: () => enabled && isDrawingRef.current,
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderGrant: (evt) => {
        if (!enabled) return;
        const { locationX, locationY } = evt.nativeEvent;
        const x = Math.max(0, Math.min(CANVAS_WIDTH, locationX));
        const y = Math.max(0, Math.min(CANVAS_HEIGHT, locationY));
        const newPoint = { x, y };
        setCurrentPath([newPoint]);
        isDrawingRef.current = true;
      },
      onPanResponderMove: (evt) => {
        if (!enabled || !isDrawingRef.current) return;
        const { locationX, locationY } = evt.nativeEvent;
        const x = Math.max(0, Math.min(CANVAS_WIDTH, locationX));
        const y = Math.max(0, Math.min(CANVAS_HEIGHT, locationY));
        const newPoint = { x, y };
        
        setCurrentPath((prev) => {
          // Avoid duplicate or very close points for performance
          if (prev.length > 0) {
            const lastPoint = prev[prev.length - 1];
            const dx = lastPoint.x - x;
            const dy = lastPoint.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 0.5) return prev; // Skip if too close
          }
          
          const newPath = [...prev, newPoint];
          // Limit path points for performance (throttle during drawing)
          if (newPath.length > 500) {
            return newPath.slice(-500);
          }
          return newPath;
        });
      },
      onPanResponderRelease: () => {
        if (isDrawingRef.current) {
          finishPath();
        }
      },
      onPanResponderTerminate: () => {
        if (isDrawingRef.current) {
          finishPath();
          isDrawingRef.current = false;
        }
      },
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
    })
  ).current;

  // Convert points to SVG path string
  const pathToSvgPath = (points: Point[]): string => {
    if (points.length === 0) return '';
    if (points.length === 1) {
      return `M ${points[0].x} ${points[0].y}`;
    }
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    // Simple line-to for all points - reliable and smooth enough
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    
    return path;
  };

  return (
    <View style={styles.container}>
      <View 
        style={styles.canvas} 
        {...panResponder.panHandlers}
        collapsable={false}
        pointerEvents="auto"
      >
        <Svg 
          width={CANVAS_WIDTH} 
          height={CANVAS_HEIGHT}
          style={styles.svg}
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        >
          {/* Render drawing paths first */}
          {paths
            .filter(path => !path.isEraser)
            .map((path, index) => (
            <Path
                key={`draw-path-${index}-${path.points.length}`}
              d={pathToSvgPath(path.points)}
              stroke={path.color}
              strokeWidth={path.strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
                strokeMiterlimit={10}
            />
          ))}
          {/* Render current drawing path */}
          {currentPath.length > 0 && !isEraser && (
            <Path
              key="current-draw-path"
              d={pathToSvgPath(currentPath)}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit={10}
            />
          )}
          {/* Render eraser indicator (red dashed outline) */}
          {currentPath.length > 0 && isEraser && (
            <Path
              key="current-eraser-path"
              d={pathToSvgPath(currentPath)}
              stroke="#EF4444"
              strokeWidth={Math.max(strokeWidth * 4, 20)}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit={10}
              strokeDasharray="8,4"
              opacity={0.5}
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
    position: 'relative',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});