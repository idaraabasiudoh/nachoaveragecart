"use client";

import { useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import emojiDictionary from "emoji-dictionary";

type Plate3DProps = {
  initialIngredients: string[];
};

function getEmoji(name: string): string {
  const lower = name.toLowerCase();
  const em = emojiDictionary.getUnicode(lower);
  if (em) return em;

  const fallback = emojiDictionary.names.find((n) =>
    lower.includes(n.toLowerCase())
  );
  if (fallback) return emojiDictionary.getUnicode(fallback) || "🍽️";

  return "🍽️";
}

function FloatingIngredientIcon({
  name,
  index,
  total,
  y = 1.2,
}: {
  name: string;
  index: number;
  total: number;
  y?: number;
}) {
  const radius = 2.5;
  const angle = (index / total) * 2 * Math.PI;
  const x = radius * Math.cos(angle);
  const z = radius * Math.sin(angle);

  return (
    <Html
      position={[x, y, z]}
      center
      distanceFactor={8}
      style={{
        fontSize: "2.2rem",
        textShadow: "0 0 10px rgba(0,0,0,0.7)",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      {getEmoji(name)}
    </Html>
  );
}

function CartContents({ items }: { items: string[] }) {
  const cols = 3;
  return (
    <>
      {items.map((name, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const spacing = 0.7;

        const x = col * spacing - spacing;
        const y = 1.2;
        const z = row * spacing - spacing;

        return (
          <Html
            key={i}
            position={[x, y, z]}
            center
            distanceFactor={8}
            style={{
              fontSize: "2rem",
              textShadow: "0 0 8px rgba(0,0,0,0.7)",
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            {getEmoji(name)}
          </Html>
        );
      })}
    </>
  );
}

export default function Plate3D({ initialIngredients }: Plate3DProps) {
  const [cards, setCards] = useState(initialIngredients);
  const [kept, setKept] = useState<string[]>([]);

  const onSwipe = useCallback(
    (name: string, direction: "left" | "right") => {
      setCards((prev) => prev.filter((c) => c !== name));
      if (direction === "right") setKept((prev) => [...prev, name]);
    },
    []
  );

  const onReset = () => {
    setCards(initialIngredients);
    setKept([]);
  };

  return (
    <div className="flex flex-col items-center w-full space-y-6">
      {/* Cards centered */}
      <div className="w-full flex flex-col items-center space-y-4">
        <div className="relative w-64 h-96">
          <AnimatePresence>
            {cards.map((name, i) => (
              <motion.div
                key={name}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.3}
                onDragEnd={(_e, info: PanInfo) => {
                  const threshold = 100;
                  if (info.offset.x > threshold) onSwipe(name, "right");
                  else if (info.offset.x < -threshold) onSwipe(name, "left");
                }}
                initial={{ scale: 0.95, y: i * 15, opacity: 1 }}
                animate={{ scale: 1, y: i * 15, opacity: 1 }}
                exit={{
                  x: kept.includes(name) ? 500 : -500,
                  opacity: 0,
                  scale: 0.5,
                }}
                transition={{ duration: 0.3 }}
                className="absolute top-0 left-0 w-64 h-80 bg-[#111827] text-white rounded-xl shadow-2xl flex flex-col items-center justify-center border border-gray-600"
              >
                <div className="text-8xl mb-2">{getEmoji(name)}</div>
                <div className="text-xl font-semibold capitalize">{name}</div>
                <div className="mt-2 text-sm text-gray-400 text-center px-4">
                  Swipe right to cook, left to discard
                </div>
              </motion.div>
            ))}
            {cards.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-0 left-0 w-64 h-80 bg-cyan-700 text-white rounded-xl shadow-2xl flex items-center justify-center font-bold text-center p-4"
              >
                No more ingredients! Your dish is ready 🍽️
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-600 hover:bg-gray-700 transition hover:cursor-pointer active:scale-95"
        >
          Reset Ingredients
        </button>
      </div>

      {/* 3D Canvas aligned to the left */}
      <div className="w-full flex justify-start">
        <div className="w-[50%] h-[350px] rounded-xl overflow-hidden border border-gray-700 relative">
          <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 5]} intensity={1.2} />

            {/* Floating Ingredients */}
            <group position={[-2, 0, 0]}>
              {cards.map((name, i) => (
                <FloatingIngredientIcon
                  key={i}
                  name={name}
                  index={i}
                  total={cards.length}
                />
              ))}
            </group>

            {/* Cart */}
            <group position={[4, 0, 0]}>
              <mesh>
                <boxGeometry args={[3, 1.5, 2]} />
                <meshStandardMaterial color="#1f1f1f" />
              </mesh>
              <CartContents items={kept} />
            </group>

            <OrbitControls
              enablePan={false}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={(3 * Math.PI) / 5}
              maxDistance={15}
              minDistance={5}
            />
          </Canvas>
        </div>
      </div>
    </div>
  );
}
