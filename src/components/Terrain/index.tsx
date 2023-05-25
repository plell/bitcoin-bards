


export const Terrain = () => {
    return <>
        <mesh position={[0, 20, -1]} rotation-z={ Math.PI}> 
            <planeGeometry args={[40,300]} />
            <meshStandardMaterial color={'tomato'}/>
            </mesh>
    </>
}
