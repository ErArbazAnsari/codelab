import { useEffect, useRef, useState } from "react";

const codeLines = [
    "# Two Sum Problem",
    "def two_sum(nums, target):",
    "    map = {}",
    "    for i, num in enumerate(nums):",
    "        diff = target - num",
    "        if diff in map:",
    "            return [map[diff], i]",
    "        map[num] = i",
    "    return []",
];

const colorMap = [
  "text-blue-400", // comment
  "text-green-400", // function
  "text-purple-400", // if
  "text-yellow-400", // const
  "text-orange-400", // let
  "text-pink-400", // let
  "text-yellow-400", // for
  "text-yellow-400", // for
  "text-pink-400", // heights
  "text-purple-400", // }
  "text-orange-400", // maxArea
  "text-purple-400", // return
  "text-orange-400", // }
  "text-green-400", // function
  "text-pink-400", // let
  "text-yellow-400", // while
  "text-yellow-400", // let h
  "text-orange-400", // if
  "text-pink-400", // stack.push
  "text-orange-400", // else
  "text-pink-400", // let top
  "text-yellow-400", // let width
  "text-orange-400", // maxArea
  "text-purple-400", // }
  "text-orange-400", // return
];

export default function TypingCode() {
  const [typedLines, setTypedLines] = useState([]);
  const [charIdx, setCharIdx] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [isTyping] = useState(true);
  const timeoutRef = useRef();

  useEffect(() => {
    if (!isTyping) return;
    if (lineIdx < codeLines.length) {
      if (charIdx < codeLines[lineIdx].length) {
        timeoutRef.current = setTimeout(() => {
          setTypedLines((prev) => {
            const newLines = [...prev];
            if (!newLines[lineIdx]) newLines[lineIdx] = "";
            newLines[lineIdx] += codeLines[lineIdx][charIdx];
            return newLines;
          });
          setCharIdx((c) => c + 1);
        }, 18);
      } else {
        setCharIdx(0);
        setLineIdx((l) => l + 1);
      }
    } else {
      // Pause, then restart
      setTimeout(() => {
        setTypedLines([]);
        setCharIdx(0);
        setLineIdx(0);
      }, 1200);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [charIdx, lineIdx, isTyping]);

  return (
    <div className={`space-y-1 w-[30rem] max-w-full overflow-x-auto`}>
      {codeLines.map((line, idx) => (
        <div
          key={idx}
          className={colorMap[idx % colorMap.length] + " font-mono whitespace-pre"}
        >
          {typedLines[idx] || ""}
          {lineIdx === idx && <span className="inline-block w-2 h-5 bg-green-400 animate-pulse rounded-sm align-middle ml-1" />}
        </div>
      ))}
    </div>
  );
}
