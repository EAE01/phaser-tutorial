window.addEventListener('load', ()=>{
  const game = new Game()
})
class Game{
  constructor(){
    console.log('Initialising game')
    this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: this.preload.bind(this), create: this.create.bind(this), update: this.update.bind(this) });
  }

  preload(){
    const game = this.game
    game.load.image('background', 'assets/img/background.jpg')
    game.load.image('star', 'assets/img/collectible.png')
    game.load.image('ground', 'assets/img/ground.png')
    game.load.spritesheet('character', 'assets/img/character-sprite.png', 32, 48)
    console.log('Assets loaded')
  }

  create(){
    const game = this.game
    game.add.sprite(-100, 0, 'background').scale.setTo(0.6, 0.6)

    game.physics.startSystem(Phaser.Physics.ARCADE)
    this.platforms = game.add.group()
    this.platforms.enableBody = true

    this.ground = this.platforms.create(0, game.world.height - 90, 'ground')
    this.ground.scale.setTo(0.1, 0.1)
    this.ground.body.immovable = true

    this.addLedge(400, 400)

    this.addLedge(-150, 250)

    this.player = game.add.sprite(32, game.world.height - 150, 'character')
    game.physics.arcade.enable(this.player)
    this.player.body.bounce.y = 0.2
    this.player.body.gravity.y = 300
    this.player.body.collideWorldBounds = true

    this.player.animations.add('left', [0,1,2,3], 10, true)
    this.player.animations.add('right', [5,6,7,8], 10, true)
    this.player.idle = ()=>{
      this.player.animations.stop()
      this.player.frame = 4
    }

    this.arrows = game.input.keyboard.createCursorKeys()
  }

  update(){
    const game = this.game
    let hitPlatform = game.physics.arcade.collide(this.player, this.platforms)

    this.player.body.velocity.x = 0

    if(this.arrows.left.isDown){
      this.player.body.velocity.x = -150
      this.player.animations.play('left')
    }
    else if(this.arrows.right.isDown){
      this.player.body.velocity.x = 150
      this.player.animations.play('right')
    }
    else{
      this.player.idle()
    }
  }

  addLedge(x, y, scale = [0.05, 0.05]){
    let ledge = this.platforms.create(x, y, 'ground')
    ledge.scale.setTo(scale[0], scale[1])
    ledge.body.immovable = true
    return ledge
  }
}