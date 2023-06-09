export default[
    {
        name: 'environmentMapTexture',
        type: 'cubeTexture',
        path: [
            '/textures/environmentMap/px.jpg',
            '/textures/environmentMap/nx.jpg',
            '/textures/environmentMap/py.jpg',
            '/textures/environmentMap/ny.jpg',
            '/textures/environmentMap/pz.jpg',
            '/textures/environmentMap/nz.jpg',
        ]
    },
    {
        name: 'grassColorTexture',
        type: 'texture',
        path: '/textures/color.jpg'
    },
    {
        name: 'steelColorTexture',
        type: 'texture',
        path: '/textures/steel.jpeg'
    },
    {
        name: 'testTexture',
        type: 'texture',
        path: '/textures/test.jpeg'
    },
    // {
    //     name: 'grassNormalTexture',
    //     type: 'texture',
    //     path: '/textures/dirt/normal.jpg'
    // },
    {
        name: 'floorModel',
        type: 'gltfModel',
        //path: '/models/MapTutorial.glb'
        path: '/models/MapTutorial_v2.glb'
    },
    {
        name: 'playerModel',
        type: 'gltfModel',
        path: '/models/Playerv3.glb'
    },
    {
        name: 'puppetModel',
        type: 'gltfModel',
        path: '/models/puppet/scene.gltf'
    },
]