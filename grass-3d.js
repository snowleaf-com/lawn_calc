/**
 * 庭シーン：家・木・地面（DESIGN.md）— 芝ブレードは出さない
 */
;(function () {
  const C = {
    primary: 0x3ecf8e,
    primaryDeep: 0x24b47e,
    canvasNight: 0x1c1c1c,
    skyTop: 0xf7fdfb,
    skyHorizon: 0xe5f4ec,
    wall: 0xf2ede6,
    roof: 0x2a2a2a,
  }

  class GardenHeroScene {
    constructor() {
      this.scene = null
      this.camera = null
      this.renderer = null
      this.sun = null
      this.animationId = null
      this.time = 0
      this.textures = []
      this.init()
    }

    init() {
      this.scene = new THREE.Scene()
      this.scene.fog = new THREE.Fog(C.skyHorizon, 22, 120)
      this.scene.background = new THREE.Color(C.skyTop)

      this.camera = new THREE.PerspectiveCamera(
        46,
        window.innerWidth / window.innerHeight,
        0.1,
        220
      )

      const canvas = document.getElementById('grass-canvas')
      this.renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })

      const container = document.getElementById('grass-canvas-container')
      const w = container.clientWidth || window.innerWidth * 0.5
      const h = container.clientHeight || window.innerHeight * 0.6

      this.renderer.setSize(w, h)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      this.renderer.setClearColor(C.skyHorizon, 1)
      if (this.renderer.outputEncoding !== undefined) {
        this.renderer.outputEncoding = THREE.sRGBEncoding
      }
      this.renderer.shadowMap.enabled = true
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
      if (THREE.ACESFilmicToneMapping !== undefined) {
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping
        this.renderer.toneMappingExposure = 1.05
      }

      this.setupLights()
      this.createGround()
      this.createHouse()
      this.createTrees()

      this.animate()
      window.addEventListener('resize', () => this.handleResize())
    }

    setupLights() {
      const hemi = new THREE.HemisphereLight(0xffffff, C.primaryDeep, 0.5)
      this.scene.add(hemi)

      const ambient = new THREE.AmbientLight(0xffffff, 0.24)
      this.scene.add(ambient)

      this.sun = new THREE.DirectionalLight(0xfff8f2, 1.05)
      this.sun.position.set(26, 36, 18)
      this.sun.castShadow = true
      this.sun.shadow.mapSize.width = 2048
      this.sun.shadow.mapSize.height = 2048
      this.sun.shadow.camera.near = 2
      this.sun.shadow.camera.far = 100
      this.sun.shadow.camera.left = -42
      this.sun.shadow.camera.right = 42
      this.sun.shadow.camera.top = 42
      this.sun.shadow.camera.bottom = -42
      this.sun.shadow.bias = -0.0001
      this.scene.add(this.sun)

      const fill = new THREE.DirectionalLight(0xd8f0e8, 0.28)
      fill.position.set(-14, 12, -8)
      this.scene.add(fill)
    }

    /** 平らな芝生風（ランダム点・インスタンスなし） */
    createGround() {
      const geo = new THREE.PlaneGeometry(140, 140, 24, 24)
      const pos = geo.attributes.position
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i)
        const y = pos.getY(i)
        const h =
          Math.sin(x * 0.025) * 0.06 +
          Math.cos(y * 0.022) * 0.05
        pos.setZ(i, h)
      }
      geo.rotateX(-Math.PI / 2)
      geo.computeVertexNormals()

      const mat = new THREE.MeshStandardMaterial({
        color: C.primaryDeep,
        roughness: 0.94,
        metalness: 0,
      })

      const mesh = new THREE.Mesh(geo, mat)
      mesh.receiveShadow = true
      this.scene.add(mesh)
    }

    /**
     * 躯体と屋根の幅・奥行きを一致させる。
     * 四角錐（4细分）は回転45°で箱形 footprint に揃える。
     */
    createHouse() {
      const houseZ = -14
      const wallW = 9
      const wallD = 7.5
      const wallH = 4

      const wallMat = new THREE.MeshStandardMaterial({
        color: C.wall,
        roughness: 0.88,
        metalness: 0.04,
      })
      const roofMat = new THREE.MeshStandardMaterial({
        color: C.roof,
        roughness: 0.78,
        metalness: 0.12,
      })
      const wood = new THREE.MeshStandardMaterial({
        color: 0x5a4838,
        roughness: 0.92,
        metalness: 0,
      })
      const glass = new THREE.MeshStandardMaterial({
        color: 0xb8dce8,
        roughness: 0.3,
        metalness: 0.18,
      })

      const g = new THREE.Group()

      const body = new THREE.Mesh(
        new THREE.BoxGeometry(wallW, wallH, wallD),
        wallMat
      )
      body.position.set(0, wallH / 2, houseZ)
      body.castShadow = true
      body.receiveShadow = true
      g.add(body)

      const roofH = 2.6
      const roofR = 6.6
      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(roofR, roofH, 4),
        roofMat
      )
      roof.position.set(0, wallH + roofH / 2, houseZ)
      roof.rotation.y = Math.PI / 4
      roof.castShadow = true
      g.add(roof)

      const frontZ = houseZ + wallD / 2 + 0.18
      const door = new THREE.Mesh(
        new THREE.BoxGeometry(2, 3.2, 0.2),
        wood
      )
      door.position.set(0, 1.6, frontZ)
      door.castShadow = true
      g.add(door)

      const wg = new THREE.BoxGeometry(1.8, 1.6, 0.12)
      const w1 = new THREE.Mesh(wg, glass)
      w1.position.set(-2.8, 2.9, frontZ)
      g.add(w1)
      const w2 = new THREE.Mesh(wg, glass)
      w2.position.set(2.8, 2.9, frontZ)
      g.add(w2)

      const backZ = houseZ - wallD / 2 - 0.12
      const w3 = new THREE.Mesh(wg, glass)
      w3.position.set(0, 2.9, backZ)
      g.add(w3)

      this.scene.add(g)
    }

    createTrees() {
      const trunkMat = new THREE.MeshStandardMaterial({
        color: 0x5c4637,
        roughness: 0.9,
        metalness: 0,
      })
      const leafMat = new THREE.MeshStandardMaterial({
        color: C.primaryDeep,
        roughness: 0.78,
        metalness: 0,
      })

      const spots = [
        { x: -14, z: -4, s: 1.1 },
        { x: 12, z: -2, s: 0.95 },
        { x: -11, z: 6, s: 1.05 },
        { x: 15, z: 8, s: 1.15 },
        { x: -18, z: 8, s: 0.88 },
        { x: 8, z: -12, s: 1.0 },
        { x: -9, z: -14, s: 0.92 },
        { x: 18, z: -6, s: 1.08 },
        { x: -6, z: 14, s: 0.85 },
        { x: 11, z: 14, s: 1.02 },
        { x: -16, z: -12, s: 0.9 },
      ]

      spots.forEach((sp) => {
        const trunkGeo = new THREE.CylinderGeometry(0.35, 0.52, 3.2, 10)
        const crownGeo = new THREE.IcosahedronGeometry(2.4, 1)

        const tree = new THREE.Group()
        const trunk = new THREE.Mesh(trunkGeo, trunkMat)
        trunk.position.y = 1.6
        trunk.castShadow = true
        trunk.receiveShadow = true
        tree.add(trunk)

        const crown = new THREE.Mesh(crownGeo, leafMat)
        crown.position.y = 4.4
        crown.scale.setScalar(sp.s)
        crown.castShadow = true
        crown.receiveShadow = true
        tree.add(crown)

        tree.position.set(sp.x, 0, sp.z)
        tree.rotation.y = Math.random() * 6.28
        this.scene.add(tree)
      })
    }

    animate() {
      this.animationId = requestAnimationFrame(() => this.animate())
      this.time += 0.016

      const a = this.time * 0.1
      const dist = 24
      this.camera.position.set(
        Math.sin(a) * dist * 0.48 + 1.5,
        5.2 + Math.sin(this.time * 0.06) * 0.28,
        12.5 + Math.cos(a) * dist * 0.4
      )
      this.camera.lookAt(0, 2.6, -13)

      this.renderer.render(this.scene, this.camera)
    }

    handleResize() {
      const container = document.getElementById('grass-canvas-container')
      const cw = container.clientWidth
      const ch = container.clientHeight
      this.camera.aspect = cw / ch
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(cw, ch)
      this.renderer.render(this.scene, this.camera)
    }

    destroy() {
      if (this.animationId) cancelAnimationFrame(this.animationId)
      this.textures.forEach((tex) => tex.dispose())
      this.textures = []

      const seen = new Set()
      this.scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          const mats = Array.isArray(obj.material)
            ? obj.material
            : [obj.material]
          mats.forEach((m) => {
            if (seen.has(m)) return
            seen.add(m)
            m.map = null
            m.dispose()
          })
        }
      })

      this.renderer.dispose()
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const scene = new GardenHeroScene()
    window.addEventListener('beforeunload', () => scene.destroy())
  })
})()
