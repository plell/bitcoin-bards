import { useEffect, useState } from "react";

import useGame from "../../../../Stores/useGame";

type Timeout = ReturnType<typeof setTimeout> | null;

let attackDuration: Timeout = null;

export const AttackEffect = () => {
  const attack = useGame((s) => s.attack);

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (attackDuration) {
      clearTimeout(attackDuration);
    }

    setShow(true);
    attackDuration = setTimeout(() => {
      setShow(false);
    }, 80);

    return function clean() {
      if (attackDuration) {
        clearTimeout(attackDuration);
      }
    };
  }, [attack]);

  return (
    <mesh scale={show ? 4 : 0}>
      <circleGeometry args={[2]} />
      <meshStandardMaterial wireframe color={"#000"} />
    </mesh>
  );
};
