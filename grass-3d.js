// 3D Simple Landscape Scene
class LandscapeScene {
  constructor() {
    this.scene = null
    this.camera = null
    this.renderer = null
    this.animationId = null
    this.sun = null
    this.clouds = []
    this.trees = []
    this.time = 0

    this.init()
  }

  init() {
    // Scene setup
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.Fog(0x87ceeb, 50, 200)

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.camera.position.set(0, 15, 25)
    this.camera.lookAt(0, 0, 0)

    // Renderer setup
    const canvas = document.getElementById('grass-canvas')
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    })

    // Set initial size based on container
    const container = document.getElementById('grass-canvas-container')
    const containerWidth = container.clientWidth || window.innerWidth * 0.5
    const containerHeight = container.clientHeight || window.innerHeight * 0.6 // デフォルトを調整

    this.renderer.setSize(containerWidth, containerHeight)
    this.renderer.setClearColor(0x87ceeb, 1)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // Lighting
    this.setupLighting()

    // Create landscape elements
    this.createGround()
    this.createHouse()
    this.createMountains()
    this.createTrees()
    this.createClouds()

    // Start render loop
    this.animate()

    // Handle resize
    window.addEventListener('resize', () => this.handleResize())
  }

  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    this.scene.add(ambientLight)

    // Sun light
    this.sun = new THREE.DirectionalLight(0xffffff, 1.2)
    this.sun.position.set(30, 40, 20)
    this.sun.castShadow = true
    this.sun.shadow.mapSize.width = 2048
    this.sun.shadow.mapSize.height = 2048
    this.sun.shadow.camera.near = 0.1
    this.sun.shadow.camera.far = 200
    this.sun.shadow.camera.left = -50
    this.sun.shadow.camera.right = 50
    this.sun.shadow.camera.top = 50
    this.sun.shadow.camera.bottom = -50
    this.scene.add(this.sun)

    // Visual sun
    const sunGeometry = new THREE.SphereGeometry(3, 16, 16)
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.5,
    })
    this.sunMesh = new THREE.Mesh(sunGeometry, sunMaterial)
    this.sunMesh.position.copy(this.sun.position)
    this.scene.add(this.sunMesh)
  }

  createGround() {
    // Grass ground
    const groundGeometry = new THREE.PlaneGeometry(200, 200)
    const groundMaterial = new THREE.MeshLambertMaterial({
      color: 0x2d5a2d,
    })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    this.scene.add(ground)
  }

  createHouse() {
    // House body - シンプルな家に戻す
    const houseGeometry = new THREE.BoxGeometry(12, 8, 10)
    const houseMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 })
    const house = new THREE.Mesh(houseGeometry, houseMaterial)
    house.position.set(-10, 4, -5)
    house.castShadow = true
    house.receiveShadow = true
    this.scene.add(house)

    // Roof - 三角屋根（家の本体に合わせてサイズ調整）
    const roofGeometry = new THREE.ConeGeometry(7, 5, 4) // 半径を7に調整（家の幅12に対して適切）
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8b0000 })
    const roof = new THREE.Mesh(roofGeometry, roofMaterial)
    roof.position.set(-10, 10.5, -5) // 家の中心と完全に一致
    roof.rotation.y = Math.PI / 4
    roof.castShadow = true
    this.scene.add(roof)

    // Door
    const doorGeometry = new THREE.BoxGeometry(2.5, 4, 0.2)
    const doorMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 })
    const door = new THREE.Mesh(doorGeometry, doorMaterial)
    door.position.set(-10, 2, 0.2)
    this.scene.add(door)

    // Windows
    const windowGeometry = new THREE.BoxGeometry(2, 2, 0.2)
    const windowMaterial = new THREE.MeshLambertMaterial({ color: 0x87ceeb })

    const window1 = new THREE.Mesh(windowGeometry, windowMaterial)
    window1.position.set(-13.5, 5, 0.2)
    this.scene.add(window1)

    const window2 = new THREE.Mesh(windowGeometry, windowMaterial)
    window2.position.set(-6.5, 5, 0.2)
    this.scene.add(window2)

    // 背面の窓
    const window3 = new THREE.Mesh(windowGeometry, windowMaterial)
    window3.position.set(-10, 6, -10.2)
    this.scene.add(window3)
  }

  createMountains() {
    const mountainColors = [0x4a5d23, 0x5a6d33, 0x6a7d43]

    for (let i = 0; i < 7; i++) {
      const mountainHeight = 15 + Math.random() * 10
      // 横に大きく
      const mountainGeometry = new THREE.ConeGeometry(
        15 + Math.random() * 8,
        mountainHeight,
        8
      )
      const mountainMaterial = new THREE.MeshLambertMaterial({
        color: mountainColors[i % mountainColors.length],
      })
      const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial)

      mountain.position.set(
        -60 + i * 20 + Math.random() * 10,
        mountainHeight / 2,
        -40 - Math.random() * 20
      )
      mountain.receiveShadow = true
      this.scene.add(mountain)
    }
  }

  createTrees() {
    // 木を軽い処理で配置
    for (let i = 0; i < 15; i++) {
      const tree = this.createSingleTree()

      // シンプルな配置
      let x = (Math.random() - 0.5) * 80
      let z = (Math.random() - 0.5) * 80

      // 山のエリア（z < -20）を避ける
      if (z < -20) {
        z = Math.random() * 40 // 0から40の範囲に調整
      }

      // 家から離す（家の位置は(-10, 0, -5)）
      if (Math.abs(x + 10) < 15 && Math.abs(z + 5) < 15) {
        x += x > -10 ? 20 : -20
      }

      tree.position.set(x, 0, z)

      // ランダムなスケール変化
      const scale = 0.8 + Math.random() * 0.4
      tree.scale.set(scale, scale, scale)

      // ランダムな回転
      tree.rotation.y = Math.random() * Math.PI * 2

      this.trees.push(tree)
      this.scene.add(tree)
    }
  }

  createSingleTree() {
    const treeGroup = new THREE.Group()

    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 4, 8)
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 })
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial)
    trunk.position.y = 2
    trunk.castShadow = true
    trunk.receiveShadow = true
    treeGroup.add(trunk)

    // Leaves
    const leavesGeometry = new THREE.SphereGeometry(3, 12, 8)
    const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228b22 })
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial)
    leaves.position.y = 6
    leaves.castShadow = true
    leaves.receiveShadow = true
    treeGroup.add(leaves)

    return treeGroup
  }

  createClouds() {
    for (let i = 0; i < 8; i++) {
      const cloud = this.createSingleCloud()
      cloud.position.set(
        (Math.random() - 0.5) * 150,
        20 + Math.random() * 10,
        (Math.random() - 0.5) * 150
      )
      this.clouds.push(cloud)
      this.scene.add(cloud)
    }
  }

  createSingleCloud() {
    const cloudGroup = new THREE.Group()
    const cloudMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
    })

    // Multiple spheres to form a cloud
    for (let i = 0; i < 5; i++) {
      const sphereGeometry = new THREE.SphereGeometry(
        2 + Math.random() * 2,
        8,
        6
      )
      const sphere = new THREE.Mesh(sphereGeometry, cloudMaterial)
      sphere.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 8
      )
      cloudGroup.add(sphere)
    }

    return cloudGroup
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate())
    this.time += 0.01

    // Animate clouds
    this.clouds.forEach((cloud, index) => {
      cloud.position.x += 0.02 * (index % 2 === 0 ? 1 : -1)
      if (cloud.position.x > 100) cloud.position.x = -100
      if (cloud.position.x < -100) cloud.position.x = 100
    })

    // Animate trees (slight sway)
    this.trees.forEach((tree, index) => {
      tree.rotation.z = Math.sin(this.time + index) * 0.02
    })

    // Animate sun position (day cycle)
    const sunRadius = 50
    this.sun.position.x = Math.cos(this.time * 0.1) * sunRadius
    this.sun.position.y = Math.abs(Math.sin(this.time * 0.1)) * 40 + 10
    this.sun.position.z = Math.sin(this.time * 0.1) * sunRadius * 0.5
    this.sunMesh.position.copy(this.sun.position)

    this.render()
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  handleResize() {
    const container = document.getElementById('grass-canvas-container')

    // コンテナの実際のサイズを取得
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight

    // カメラのアスペクト比を更新
    this.camera.aspect = containerWidth / containerHeight

    // レンダラーのサイズを更新
    this.renderer.setSize(containerWidth, containerHeight)

    // カメラの投影行列を更新
    this.camera.updateProjectionMatrix()

    // 再レンダリング
    this.render()
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }

    // Clean up
    this.scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose()
      if (object.material) object.material.dispose()
    })

    this.renderer.dispose()
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const landscapeScene = new LandscapeScene()

  window.addEventListener('beforeunload', () => {
    landscapeScene.destroy()
  })
})
