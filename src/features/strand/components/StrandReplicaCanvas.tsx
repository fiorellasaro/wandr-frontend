import { useEffect, useRef } from "react";

type CanvasStopState = "done" | "active" | "warn" | "upcoming";

export interface StrandReplicaStop {
  id: string;
  name: string;
  district: string;
  time: string;
  rating: number;
  reviewCount: number;
  walkIn: boolean;
  duration: number;
  desc: string;
  distToNext: string | null;
  state: CanvasStopState;
}

interface StrandReplicaCanvasProps {
  stops: StrandReplicaStop[];
  currentDate: Date;
  matchStopIndex: number;
  selectedStopIndex: number | null;
  onSelectStop: (index: number | null) => void;
  replanSignal: number;
  pulseSignal: number;
}

interface DrawNode {
  y: number;
  xL: number;
  xR: number;
  phase: number;
  morphWave: number;
  globalWave: number;
  stop: StrandReplicaStop;
  i: number;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getDateMinutes(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

function parseTimeLabelMinutes(label: string) {
  const matches = Array.from(label.matchAll(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/gi));
  const match = matches.at(-1);

  if (!match) {
    return null;
  }

  const [, hourValue, minuteValue = "0", periodValue] = match;
  const period = periodValue.toUpperCase();
  let hour = Number.parseInt(hourValue, 10);
  const minute = Number.parseInt(minuteValue, 10);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return null;
  }

  if (period === "AM" && hour === 12) {
    hour = 0;
  } else if (period === "PM" && hour !== 12) {
    hour += 12;
  }

  return hour * 60 + minute;
}

function normalizeStopMinutes(stops: StrandReplicaStop[]) {
  let dayOffset = 0;
  let previous = -Infinity;

  return stops.map((stop) => {
    const minutes = parseTimeLabelMinutes(stop.time);

    if (minutes === null) {
      return null;
    }

    let normalized = minutes + dayOffset;

    while (normalized < previous) {
      dayOffset += 24 * 60;
      normalized = minutes + dayOffset;
    }

    previous = normalized;

    return normalized;
  });
}

function normalizeCurrentMinutes(
  currentMinutes: number,
  firstStopMinutes: number,
  lastStopMinutes: number,
) {
  let normalized = currentMinutes;

  while (normalized < firstStopMinutes - 12 * 60) {
    normalized += 24 * 60;
  }

  while (normalized > lastStopMinutes + 12 * 60) {
    normalized -= 24 * 60;
  }

  return normalized;
}

function getCurrentStrandPosition(
  nodes: DrawNode[],
  currentMinutes: number,
) {
  const stopMinutes = normalizeStopMinutes(nodes.map((node) => node.stop));
  const firstStopMinutes = stopMinutes.find((minutes) => minutes !== null);
  let lastStopMinutes: number | null | undefined;

  for (let index = stopMinutes.length - 1; index >= 0; index -= 1) {
    if (stopMinutes[index] !== null) {
      lastStopMinutes = stopMinutes[index];
      break;
    }
  }

  if (
    nodes.length === 0 ||
    firstStopMinutes === undefined ||
    firstStopMinutes === null ||
    lastStopMinutes === undefined ||
    lastStopMinutes === null
  ) {
    return null;
  }

  const normalizedCurrent = normalizeCurrentMinutes(
    currentMinutes,
    firstStopMinutes,
    lastStopMinutes,
  );

  for (let index = 0; index < stopMinutes.length; index += 1) {
    const minutes = stopMinutes[index];

    if (minutes === null) {
      continue;
    }

    if (normalizedCurrent <= minutes) {
      return {
        y: nodes[index].y,
        progress: 0,
        labelAlign: "after" as const,
      };
    }

    const nextMinutes = stopMinutes[index + 1];
    const nextNode = nodes[index + 1];

    if (nextMinutes === null || !nextNode) {
      continue;
    }

    if (normalizedCurrent <= nextMinutes) {
      const segmentProgress = clamp(
        (normalizedCurrent - minutes) / Math.max(1, nextMinutes - minutes),
        0,
        1,
      );

      return {
        y: lerp(nodes[index].y, nextNode.y, segmentProgress),
        progress: segmentProgress,
        labelAlign: "between" as const,
      };
    }
  }

  return {
    y: nodes[nodes.length - 1].y,
    progress: 1,
    labelAlign: "before" as const,
  };
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;

    if (context.measureText(testLine).width <= maxWidth || currentLine === "") {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length > 0 ? lines : [text];
}

function extractFirstSentence(text: string) {
  const [sentence] = text.split(".");

  if (!sentence) {
    return text;
  }

  return `${sentence.trim()}.`;
}

export function StrandReplicaCanvas({
  stops,
  currentDate,
  matchStopIndex,
  selectedStopIndex,
  onSelectStop,
  replanSignal,
  pulseSignal,
}: StrandReplicaCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const widthRef = useRef(0);
  const heightRef = useRef(0);
  const hoveredStopRef = useRef<number | null>(null);
  const selectedStopRef = useRef<number | null>(selectedStopIndex);
  const lastTooltipNodeRef = useRef<DrawNode | null>(null);
  const tooltipAlphaRef = useRef(0);
  const morphProgressRef = useRef<number[]>(stops.map(() => 0));
  const targetMorphRef = useRef<number[]>(stops.map(() => 0));
  const globalMorphRef = useRef(0);
  const tickRef = useRef(0);
  const matchPulseRef = useRef(0);
  const currentMinutesRef = useRef(getDateMinutes(currentDate));
  const stopsRef = useRef(stops);

  stopsRef.current = stops;
  currentMinutesRef.current = getDateMinutes(currentDate);

  useEffect(() => {
    morphProgressRef.current = stops.map((_, index) => morphProgressRef.current[index] ?? 0);
    targetMorphRef.current = stops.map((_, index) => targetMorphRef.current[index] ?? 0);
  }, [stops]);

  useEffect(() => {
    selectedStopRef.current = selectedStopIndex;

    if (selectedStopIndex === null) {
      return undefined;
    }

    targetMorphRef.current[selectedStopIndex] = 0.5;
    const timeoutId = window.setTimeout(() => {
      targetMorphRef.current[selectedStopIndex] = 0;
    }, 1200);

    return () => window.clearTimeout(timeoutId);
  }, [selectedStopIndex]);

  useEffect(() => {
    if (replanSignal === 0) {
      return undefined;
    }

    globalMorphRef.current = 1;
    morphProgressRef.current = stopsRef.current.map(() => 0.8);
    targetMorphRef.current = stopsRef.current.map(() => 0.8);

    const timeoutId = window.setTimeout(() => {
      targetMorphRef.current = stopsRef.current.map(() => 0);
    }, 2200);

    return () => window.clearTimeout(timeoutId);
  }, [replanSignal]);

  useEffect(() => {
    if (pulseSignal === 0 || stopsRef.current.length === 0) {
      return undefined;
    }

    const lastIndex = stopsRef.current.length - 1;
    targetMorphRef.current[lastIndex] = 0.6;

    const timeoutId = window.setTimeout(() => {
      targetMorphRef.current[lastIndex] = 0;
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [pulseSignal]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return undefined;
    }

    const resize = () => {
      const parent = canvas.parentElement;

      if (!parent) {
        return;
      }

      const dpr = window.devicePixelRatio || 1;
      const width = parent.clientWidth;
      const height = Math.max(120 * stopsRef.current.length + 100, window.innerHeight - 160);

      widthRef.current = width;
      heightRef.current = height;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawNode = (x: number, y: number, stop: StrandReplicaStop, mp: number) => {
      const radius = 5 + mp * 4;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);

      let fill = "rgba(15,14,12,0.04)";
      let stroke = "rgba(15,14,12,0.25)";
      let lineWidth = 1;

      if (stop.state === "done") {
        fill = "rgba(15,14,12,0.08)";
        stroke = "rgba(15,14,12,0.2)";
      } else if (stop.state === "active") {
        fill = "rgba(15,14,12,0.85)";
        stroke = "rgba(15,14,12,1)";
        lineWidth = 1.5;
      } else if (stop.state === "warn") {
        fill = "rgba(201,74,26,0.12)";
        stroke = "rgba(201,74,26,0.6)";
      }

      context.fillStyle = fill;
      context.fill();
      context.strokeStyle = stroke;
      context.lineWidth = lineWidth;
      context.stroke();

      if (mp > 0.05) {
        context.beginPath();
        context.arc(x, y, radius + 4 + mp * 6, 0, Math.PI * 2);
        context.strokeStyle = `rgba(15,14,12,${mp * 0.15})`;
        context.lineWidth = 0.8;
        context.stroke();
      }
    };

    const drawLabel = (
      x: number,
      y: number,
      stop: StrandReplicaStop,
      mp: number,
    ) => {
      const alpha =
        stop.state === "done" ? 0.35 : stop.state === "active" ? 1 : stop.state === "warn" ? 0.7 : 0.55;
      const warnColor = `rgba(201,74,26,${alpha})`;
      const inkColor = `rgba(15,14,12,${alpha})`;

      context.font = "700 8px 'Space Mono', monospace";
      context.fillStyle =
        stop.state === "warn"
          ? "rgba(201,74,26,0.7)"
          : `rgba(15,14,12,${alpha * 0.7})`;
      context.textAlign = "center";
      context.fillText(stop.time.toUpperCase(), x, y - 18);

      context.font =
        stop.state === "active"
          ? "bold 11px 'Space Mono', monospace"
          : "400 10px 'Space Mono', monospace";
      context.fillStyle = stop.state === "warn" ? warnColor : inkColor;
      context.fillText(stop.name, x, y + 3);

      context.font = "400 7px 'Space Mono', monospace";
      context.fillStyle =
        stop.state === "warn"
          ? `rgba(201,74,26,${alpha * 0.5})`
          : `rgba(15,14,12,${alpha * 0.38})`;
      const districtText = stop.district.toUpperCase();
      context.fillText(districtText, x, y + 13);

      if (stop.walkIn) {
        const districtWidth = context.measureText(districtText).width;
        context.font = "700 6px 'Space Mono', monospace";
        context.fillStyle = `rgba(26,107,69,${alpha * 0.65})`;
        context.fillText("WALK-IN", x + districtWidth / 2 + 5, y + 13);
      }

      const full = Math.floor(stop.rating);
      const dotRadius = 2;
      const dotGap = 6;
      const totalWidth = 5 * dotGap;
      const startX = x - totalWidth / 2 + dotRadius;

      for (let index = 0; index < 5; index += 1) {
        const dotX = startX + index * dotGap;
        context.beginPath();
        context.arc(dotX, y + 22, dotRadius, 0, Math.PI * 2);
        context.fillStyle =
          index < full
            ? stop.state === "warn"
              ? `rgba(201,74,26,${alpha * 0.8})`
              : `rgba(15,14,12,${alpha * 0.7})`
            : `rgba(15,14,12,${alpha * 0.12})`;
        context.fill();
      }

      context.font = "400 7px 'Space Mono', monospace";
      context.fillStyle = `rgba(15,14,12,${alpha * 0.4})`;
      context.fillText(stop.rating.toFixed(1), x + totalWidth / 2 + 7, y + 25);

      if (stop.duration) {
        const durationLabel = stop.duration >= 60 ? `${Math.round(stop.duration / 60)}h` : `${stop.duration}m`;
        context.font = "400 7px 'Space Mono', monospace";
        context.fillStyle = `rgba(15,14,12,${alpha * 0.28})`;
        context.fillText(`~${durationLabel}`, x, y + 33);
      }

      if (stop.state === "active") {
        context.beginPath();
        context.arc(x - context.measureText(stop.name).width / 2 - 8, y + 3, 3, 0, Math.PI * 2);
        context.fillStyle = "rgba(15,14,12,0.9)";
        context.fill();
      }

      if (mp > 0) {
        context.beginPath();
        context.arc(x, y, 0, 0, Math.PI * 2);
      }
    };

    const drawDistanceBetween = (nodes: DrawNode[], index: number) => {
      const node = nodes[index];
      const next = nodes[index + 1];
      const midY = (node.y + next.y) / 2;

      if (!node.stop.distToNext) {
        return;
      }

      const distanceLabel = node.stop.distToNext.split("·")[0]?.trim() ?? node.stop.distToNext;
      context.save();
      context.font = "400 8px 'Space Mono', monospace";
      context.fillStyle = "rgba(26,107,69,0.55)";
      context.textAlign = "center";
      context.fillText(`↓ ${distanceLabel}`, node.xL + 8, midY);
      context.restore();
    };

    const drawCurrentTimeMarker = (nodes: DrawNode[]) => {
      const position = getCurrentStrandPosition(nodes, currentMinutesRef.current);

      if (!position) {
        return;
      }

      const centerX = widthRef.current / 2;
      const pulse = (Math.sin(tickRef.current * 5) + 1) / 2;
      const radius = 4.5 + pulse * 1.5;
      const labelY =
        position.labelAlign === "after"
          ? position.y + 18
          : position.labelAlign === "before"
            ? position.y - 14
            : position.y - 10;

      context.save();
      context.beginPath();
      context.arc(centerX, position.y, 13 + pulse * 5, 0, Math.PI * 2);
      context.strokeStyle = `rgba(26,107,69,${0.08 + pulse * 0.1})`;
      context.lineWidth = 1;
      context.stroke();

      context.beginPath();
      context.arc(centerX, position.y, radius, 0, Math.PI * 2);
      context.fillStyle = "rgba(26,107,69,0.95)";
      context.fill();
      context.strokeStyle = "rgba(245,243,239,0.98)";
      context.lineWidth = 2;
      context.stroke();

      context.font = "700 7px 'Space Mono', monospace";
      context.fillStyle = "rgba(26,107,69,0.72)";
      context.textAlign = "center";
      context.fillText("NOW", centerX, labelY);
      context.restore();
    };

    const drawTooltip = (
      xL: number,
      xR: number,
      nodeY: number,
      stop: StrandReplicaStop,
      alpha: number,
    ) => {
      const centerX = widthRef.current / 2;
      const padding = { x: 14, y: 11 };
      const minWidth = 160;
      const maxWidth = Math.min(230, widthRef.current - 16);
      const titleLineHeight = 14;
      const bodyLineHeight = 15;
      const titleBottomGap = 8;
      const rowGap = 8;
      const shortDesc = extractFirstSentence(stop.desc);

      context.font = "700 11px 'Space Mono', monospace";
      const titleLines = wrapText(
        context,
        stop.name,
        maxWidth - padding.x * 2,
      );

      context.font = "400 9px 'Space Mono', monospace";
      const descriptionLines = wrapText(
        context,
        shortDesc,
        maxWidth - padding.x * 2,
      );

      context.font = "400 8px 'Space Mono', monospace";
      const districtText = stop.district.toUpperCase();
      const walkInText = stop.walkIn ? "· WALK-IN" : "";
      const districtWidth = context.measureText(districtText).width;

      context.font = "700 7px 'Space Mono', monospace";
      const walkInWidth = walkInText ? context.measureText(walkInText).width : 0;
      const districtFitsSingleLine =
        !walkInText ||
        districtWidth + 4 + walkInWidth <= maxWidth - padding.x * 2;
      const districtBlockHeight = districtFitsSingleLine ? 8 : 17;

      const starRadius = 2.8;
      const starGap = 8;
      const starRowWidth = starRadius * 2 + starGap * 4;
      const ratingMeta = `${stop.rating.toFixed(1)} · ${stop.reviewCount.toLocaleString()} reviews`;

      context.font = "700 9px 'Space Mono', monospace";
      const ratingMetaWidth = context.measureText(ratingMeta).width;
      const ratingFitsInline =
        starRowWidth + 8 + ratingMetaWidth <= maxWidth - padding.x * 2;
      const ratingBlockHeight = ratingFitsInline ? 10 : 22;

      const widestTitleLine = Math.max(
        ...titleLines.map((line) => context.measureText(line).width),
      );

      context.font = "400 9px 'Space Mono', monospace";
      const widestDescriptionLine = Math.max(
        ...descriptionLines.map((line) => context.measureText(line).width),
      );

      const contentWidth = clamp(
        Math.max(
          minWidth,
          widestTitleLine + padding.x * 2,
          widestDescriptionLine + padding.x * 2,
          districtFitsSingleLine
            ? districtWidth + (walkInText ? walkInWidth + 8 : 0) + padding.x * 2
            : districtWidth + padding.x * 2,
          ratingFitsInline
            ? starRowWidth + ratingMetaWidth + 16 + padding.x * 2
            : Math.max(starRowWidth, ratingMetaWidth) + padding.x * 2,
        ),
        minWidth,
        maxWidth,
      );

      const innerWidth = contentWidth - padding.x * 2;
      const contentHeight =
        padding.y +
        titleLines.length * titleLineHeight +
        titleBottomGap +
        districtBlockHeight +
        rowGap +
        ratingBlockHeight +
        rowGap +
        descriptionLines.length * bodyLineHeight +
        padding.y;
      const tailHeight = 10;
      let boxX = centerX - contentWidth / 2;
      boxX = clamp(boxX, 8, widthRef.current - contentWidth - 8);

      const preferredTopY = nodeY - contentHeight - tailHeight - 8;
      const preferredBottomY = nodeY + tailHeight + 8;
      const placeBelow = preferredTopY < 8 && preferredBottomY + contentHeight <= heightRef.current - 8;
      const boxY = placeBelow
        ? preferredBottomY
        : clamp(preferredTopY, 8, heightRef.current - contentHeight - tailHeight - 8);
      const tailTipX = clamp(centerX, boxX + 16, boxX + contentWidth - 16);

      context.save();
      context.globalAlpha = alpha;

      const radius = 10;
      context.beginPath();

      if (placeBelow) {
        context.moveTo(boxX + radius, boxY);
        context.lineTo(tailTipX - 9, boxY);
        context.lineTo(tailTipX, boxY - tailHeight);
        context.lineTo(tailTipX + 9, boxY);
        context.lineTo(boxX + contentWidth - radius, boxY);
        context.quadraticCurveTo(
          boxX + contentWidth,
          boxY,
          boxX + contentWidth,
          boxY + radius,
        );
        context.lineTo(boxX + contentWidth, boxY + contentHeight - radius);
        context.quadraticCurveTo(
          boxX + contentWidth,
          boxY + contentHeight,
          boxX + contentWidth - radius,
          boxY + contentHeight,
        );
        context.lineTo(boxX + radius, boxY + contentHeight);
        context.quadraticCurveTo(
          boxX,
          boxY + contentHeight,
          boxX,
          boxY + contentHeight - radius,
        );
        context.lineTo(boxX, boxY + radius);
        context.quadraticCurveTo(boxX, boxY, boxX + radius, boxY);
      } else {
        context.moveTo(boxX + radius, boxY);
        context.lineTo(boxX + contentWidth - radius, boxY);
        context.quadraticCurveTo(
          boxX + contentWidth,
          boxY,
          boxX + contentWidth,
          boxY + radius,
        );
        context.lineTo(boxX + contentWidth, boxY + contentHeight - radius);
        context.quadraticCurveTo(
          boxX + contentWidth,
          boxY + contentHeight,
          boxX + contentWidth - radius,
          boxY + contentHeight,
        );
        context.lineTo(tailTipX + 9, boxY + contentHeight);
        context.lineTo(tailTipX, boxY + contentHeight + tailHeight);
        context.lineTo(tailTipX - 9, boxY + contentHeight);
        context.lineTo(boxX + radius, boxY + contentHeight);
        context.quadraticCurveTo(
          boxX,
          boxY + contentHeight,
          boxX,
          boxY + contentHeight - radius,
        );
        context.lineTo(boxX, boxY + radius);
        context.quadraticCurveTo(boxX, boxY, boxX + radius, boxY);
      }

      context.closePath();
      context.fillStyle = "rgba(245,243,239,0.97)";
      context.fill();
      context.strokeStyle =
        stop.state === "warn" ? "rgba(201,74,26,0.35)" : "rgba(15,14,12,0.12)";
      context.lineWidth = 1;
      context.stroke();

      let textY = boxY + padding.y + 11;
      context.font = "700 11px 'Space Mono', monospace";
      context.fillStyle =
        stop.state === "warn" ? "rgba(201,74,26,0.9)" : "rgba(15,14,12,0.92)";
      context.textAlign = "left";
      titleLines.forEach((line, index) => {
        context.fillText(line, boxX + padding.x, textY + index * titleLineHeight);
      });

      textY += titleLines.length * titleLineHeight + titleBottomGap;
      context.font = "400 8px 'Space Mono', monospace";
      context.fillStyle =
        stop.state === "warn" ? "rgba(201,74,26,0.45)" : "rgba(15,14,12,0.35)";
      context.fillText(districtText, boxX + padding.x, textY);

      if (stop.walkIn) {
        context.font = "700 7px 'Space Mono', monospace";
        context.fillStyle = "rgba(26,107,69,0.7)";
        if (districtFitsSingleLine) {
          context.fillText(walkInText, boxX + padding.x + districtWidth + 4, textY);
        } else {
          context.fillText("WALK-IN", boxX + padding.x, textY + 9);
        }
      }

      textY += districtBlockHeight + rowGap;
      let dotX = boxX + padding.x;
      const full = Math.floor(stop.rating);

      for (let index = 0; index < 5; index += 1) {
        context.beginPath();
        context.arc(dotX + starRadius, textY - starRadius, starRadius, 0, Math.PI * 2);
        context.fillStyle =
          index < full
            ? stop.state === "warn"
              ? "rgba(201,74,26,0.75)"
              : "rgba(15,14,12,0.75)"
            : "rgba(15,14,12,0.12)";
        context.fill();
        dotX += starGap;
      }

      context.font = "700 9px 'Space Mono', monospace";
      context.fillStyle = "rgba(15,14,12,0.5)";
      if (ratingFitsInline) {
        context.fillText(ratingMeta, dotX + 4, textY);
      } else {
        context.fillText(ratingMeta, boxX + padding.x, textY + 12);
      }

      textY += ratingBlockHeight + rowGap;
      context.font = "400 9px 'Space Mono', monospace";
      context.fillStyle = "rgba(58,56,50,0.6)";

      descriptionLines.forEach((line) => {
        context.fillText(line, boxX + padding.x, textY);
        textY += bodyLineHeight;
      });

      context.restore();
    };

    const draw = () => {
      context.clearRect(0, 0, widthRef.current, heightRef.current);

      const centerX = widthRef.current / 2;
      const amplitude = Math.min(widthRef.current * 0.22, 80);
      const count = stopsRef.current.length;
      const topPad = 50;
      const bottomPad = 60;
      const usableHeight = heightRef.current - topPad - bottomPad;
      const spacing = usableHeight / Math.max(1, count - 1);

      morphProgressRef.current = morphProgressRef.current.map((value, index) =>
        lerp(value, targetMorphRef.current[index] ?? 0, 0.06),
      );

      if (globalMorphRef.current > 0) {
        globalMorphRef.current = Math.max(0, globalMorphRef.current - 0.008);
      }

      const nodes = stopsRef.current.map((stop, index) => {
        const y = topPad + index * spacing;
        const phase = count === 1 ? 0 : (index / (count - 1)) * Math.PI * 2;
        const morphWave = morphProgressRef.current[index] * Math.sin(tickRef.current * 4 + phase) * 18;
        const globalWave = globalMorphRef.current * Math.sin(tickRef.current * 6 + index * 1.2) * 30;
        const xL =
          centerX - amplitude * Math.sin(tickRef.current * 0.6 + phase + morphWave * 0.05 + globalWave * 0.03);
        const xR =
          centerX + amplitude * Math.sin(tickRef.current * 0.6 + phase + morphWave * 0.05 + globalWave * 0.03);

        return {
          y,
          xL,
          xR,
          phase,
          morphWave,
          globalWave,
          stop,
          i: index,
        } satisfies DrawNode;
      });

      for (let side = 0; side < 2; side += 1) {
        context.beginPath();
        nodes.forEach((node, index) => {
          const x = side === 0 ? node.xL : node.xR;

          if (index === 0) {
            context.moveTo(x, node.y);
          } else {
            const previous = nodes[index - 1];
            const previousX = side === 0 ? previous.xL : previous.xR;
            const midY = (previous.y + node.y) / 2;
            context.bezierCurveTo(previousX, midY, x, midY, x, node.y);
          }
        });

        context.setLineDash(side === 1 ? [4, 6] : []);
        context.strokeStyle = "rgba(15,14,12,0.18)";
        context.lineWidth = 1;
        context.stroke();
        context.setLineDash([]);
      }

      const rungsPerSegment = 3;

      for (let index = 0; index < nodes.length - 1; index += 1) {
        const node = nodes[index];
        const next = nodes[index + 1];

        for (let rung = 0; rung <= rungsPerSegment; rung += 1) {
          const fraction = rung / (rungsPerSegment + 1);
          const midY = lerp(node.y, next.y, fraction);
          const phase = lerp(node.phase, next.phase, fraction);
          const tick = tickRef.current * 0.6 + phase;
          const morphWave = lerp(node.morphWave, next.morphWave, fraction);
          const globalWave = lerp(node.globalWave, next.globalWave, fraction);
          const xLeft = centerX - amplitude * Math.sin(tick + morphWave * 0.05 + globalWave * 0.03);
          const xRight = centerX + amplitude * Math.sin(tick + morphWave * 0.05 + globalWave * 0.03);
          const alpha = 0.07 + Math.abs(Math.sin(tick)) * 0.05;

          context.beginPath();
          context.moveTo(xLeft, midY);
          context.lineTo(xRight, midY);
          context.strokeStyle = `rgba(15,14,12,${alpha})`;
          context.lineWidth = 0.8;
          context.stroke();
        }
      }

      nodes.forEach((node, index) => {
        const morphProgress = morphProgressRef.current[index] ?? 0;
        drawNode(node.xL, node.y, node.stop, morphProgress);
        drawNode(node.xR, node.y, node.stop, morphProgress);
        drawLabel(centerX, node.y, node.stop, morphProgress);

        if (index < nodes.length - 1) {
          drawDistanceBetween(nodes, index);
        }
      });

      drawCurrentTimeMarker(nodes);

      matchPulseRef.current += 0.018;
      const activeStopIndex = stopsRef.current.findIndex((stop) => stop.state === "active");
      const safeActiveIndex =
        activeStopIndex >= 0 ? Math.min(activeStopIndex, nodes.length - 1) : null;
      const activeNode = safeActiveIndex !== null ? nodes[safeActiveIndex] : null;

      if (activeNode) {
        for (let ring = 0; ring < 3; ring += 1) {
          const phase = (matchPulseRef.current + ring * 0.55) % 1;
          const ringRadius = 8 + phase * 28;
          const ringAlpha = (1 - phase) * 0.18;

          context.beginPath();
          context.arc(activeNode.xL + (activeNode.xR - activeNode.xL) / 2, activeNode.y, ringRadius, 0, Math.PI * 2);
          context.strokeStyle = `rgba(15,14,12,${ringAlpha})`;
          context.lineWidth = 1;
          context.stroke();
        }
      }

      const safeMatchIndex = Math.min(Math.max(matchStopIndex, 0), nodes.length - 1);
      const matchNode = nodes[safeMatchIndex];

      if (matchNode) {
        context.save();
        context.font = "700 8px 'Space Mono', monospace";
        context.fillStyle = "rgba(15,14,12,0.4)";
        context.textAlign = "left";
        context.fillText(`◎ ${Math.max(1, safeMatchIndex === -1 ? 1 : 3)}`, matchNode.xR + 12, matchNode.y + 4);
        context.restore();
      }

      const targetAlpha = hoveredStopRef.current !== null ? 1 : 0;
      tooltipAlphaRef.current = lerp(tooltipAlphaRef.current, targetAlpha, 0.12);

      if (tooltipAlphaRef.current > 0.01 && hoveredStopRef.current !== null) {
        const node = nodes[hoveredStopRef.current];

        if (node) {
          drawTooltip(node.xL, node.xR, node.y, node.stop, tooltipAlphaRef.current);
        }
      } else if (tooltipAlphaRef.current > 0.01 && lastTooltipNodeRef.current) {
        const node = lastTooltipNodeRef.current;
        drawTooltip(node.xL, node.xR, node.y, node.stop, tooltipAlphaRef.current);
      }

      if (hoveredStopRef.current !== null && nodes[hoveredStopRef.current]) {
        lastTooltipNodeRef.current = nodes[hoveredStopRef.current] ?? null;
      }

      tickRef.current += 0.012;
      animationRef.current = window.requestAnimationFrame(draw);
    };

    const findStopIndex = (clientX: number, clientY: number, hitY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const count = stopsRef.current.length;
      const topPad = 50;
      const usableHeight = Number.parseFloat(canvas.style.height) - 110;
      const spacing = usableHeight / Math.max(1, count - 1);

      let hit: number | null = null;
      stopsRef.current.forEach((_, index) => {
        const stopY = topPad + index * spacing;

        if (Math.abs(y - stopY) < hitY && Math.abs(x - widthRef.current / 2) < 120) {
          hit = index;
        }
      });

      return hit;
    };

    const handlePointerMove = (event: PointerEvent) => {
      const hit = findStopIndex(event.clientX, event.clientY, 32);
      hoveredStopRef.current = hit;
      canvas.style.cursor = hit !== null ? "pointer" : "default";
    };

    const handlePointerLeave = () => {
      hoveredStopRef.current = null;
      canvas.style.cursor = "default";
    };

    const handleClick = (event: MouseEvent) => {
      const hit = findStopIndex(event.clientX, event.clientY, 28);
      onSelectStop(hit);
    };

    resize();
    draw();

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    canvas.addEventListener("click", handleClick);
    window.addEventListener("resize", resize);

    return () => {
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
      }

      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("click", handleClick);
      window.removeEventListener("resize", resize);
    };
  }, [matchStopIndex, onSelectStop]);

  return <canvas className="strand-replica__canvas" ref={canvasRef} />;
}
