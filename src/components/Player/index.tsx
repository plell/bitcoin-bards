import { useEffect,useRef} from 'react'
import { useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Mesh} from 'three'

const step = 0.2

export const Player = () => {
    const ref = useRef<Mesh|null>(null)
    const [subscribeKeys, getKeys] = useKeyboardControls()

    useEffect(() => {
        
        const unsubscribeAny = subscribeKeys(
            (state) => state.up,
            () => {
                console.log('up')  
            })
        
        return () => {
        
            unsubscribeAny()
        }   
    }, [])

    
    useFrame(() => {
        if (ref.current) {
            const { left, right, up, down } = getKeys()

            let _x = 0
            let _y = 0
            let _z = 0

            if (left) {
                _x -= step
            }
            if (right) {
                _x += step
            }
            if (up) {
                _y += step
            }
            if (down) {
                _y -= step
            }

            ref.current.position.set(ref.current.position.x+_x, ref.current.position.y+_y, ref.current.position.z+_z)
        }
       
    })

    return <mesh ref={ref}>
            <boxGeometry />
            <meshStandardMaterial/>
        </mesh>
}
