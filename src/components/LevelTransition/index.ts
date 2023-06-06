import { useEffect } from "react";
import useGame from "../../Stores/useGame";
import { Timeout } from "../../Stores/types";
import { useFrame } from "@react-three/fiber";

let tileSwitchTimeout: Timeout = null;

export const LevelTransition = () => {

    const worldTileRef = useGame((s) => s.worldTileRef);
    const nextWorldTile = useGame((s) => s.nextWorldTile);
    const setNextWorldTile = useGame((s) => s.setNextWorldTile);
    const setWorldTile = useGame((s) => s.setWorldTile);

    useEffect(() => {
        if (nextWorldTile) {
            if (tileSwitchTimeout) {
                clearTimeout(tileSwitchTimeout);
            }

            tileSwitchTimeout = setTimeout(() => {
                setWorldTile(nextWorldTile);
                setNextWorldTile(null);
                if (worldTileRef?.current) {
                    worldTileRef.current.position.x = 0;
                }
            }, 2000);
        }

        return function cleanup() {
            if (tileSwitchTimeout) {
                clearTimeout(tileSwitchTimeout);
            }
        };
    }, [nextWorldTile]);

    useFrame(() => {
        if (worldTileRef?.current && !!nextWorldTile) {  
            worldTileRef.current.position.x += .1;
            
        }
    });
 
    return null
}