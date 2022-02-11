import { Component, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('ans') butClick!: ElementRef;

  constructor(private renderer:Renderer2) { }

  ngOnInit(): void {
    this.placeStuff();
    this.element = document.getElementById('print-wump');
    this.inspectCurrentRoom();
    //this.showChoices();
  }

  unlisten!: () => void;
  waitForPressResolve: any;

  waitTime = false;
  playerAlive = true;
  wumpusAlive = true;
  numArrows = 3;
  wumpusRoom = 19;
  batRoom1 = 8;
  batRoom2  = 17;
  roomBatsLeft = 0;
  validNewBatRoom = false;
  batsHere = false;
  pitRoom1 = 3;
  pitRoom2 = 5;
  currentRoom = 0;
  startingRoom = 0;
  wumpusStart = 0;
  answer = '';
  element = document.getElementById('print-wump');
  rooms:number[][] = [[1, 4, 7], [0, 2, 9], [1, 3, 11], [2, 4, 13], [0, 3, 5],
  [4, 6, 14], [5, 7, 16], [0, 6, 8], [7, 9, 17], [1, 8, 10],
  [9, 11, 18], [2, 10, 12], [11, 13, 19], [3, 12, 14], [5, 13, 15],
  [14, 16, 19], [6, 15, 17], [8, 16, 18], [10, 17, 19], [12, 15, 18]];


  rand(min:number,max:number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return  Math.floor(Math.random() * (max - min) + min);
  }

  move(newRoom:number) {
    return newRoom;
  }

  isRoomAdjacent(room1:number, room2:number){
    for (var j = 0; j < 3; j++)
    {
        if (this.rooms[room1][j] == room2){
          return true;
        }
    }
    return false;
  }

  isValidMove(room:number) {
    if (room < 0) {
    return false;
  }
    if (room >= 20){
     return false;
   }
    if (!this.isRoomAdjacent(this.currentRoom, room)){
       return false;
     }

    return true;
  }

  placePlayer() {
    this.numArrows = 3;
    this.playerAlive = true;
    this.startingRoom = 0;
    this.currentRoom = this.move(0);
  }

 async parseAnswer()
  {
    //alert(myAns);
    var myAns = this.answer.replace(/[\s]/g,'');
    if(this.playerAlive == true){
    switch(myAns)
              {
                  case 'q':
                      this.performAction(myAns);
                      break;
                  case 'w':
                      this.performAction(myAns);
                      break;
                  case 'e':
                      this.performAction(myAns);
                      break;
                  default:
                    if(this.waitTime == true){
                      if(this.element){
                      this.element.textContent = "Invalid choice. Please try again.\r\n";
                      }
                      this.inspectCurrentRoom();
                      //this.showChoices();
                    }
                      break;
              }
            }
  }

  showChoices(){
    if(this.playerAlive && this.wumpusAlive && this.numArrows > 0){
      if(this.element){
        this.element.textContent += "\r\nEnter an action choice:\r\n";
        this.element.textContent += "q) Move\r\n";
        this.element.textContent += "w) Shoot\r\n";
        this.element.textContent += "e) Quit\r\n";
      }
    }
    else if(this.wumpusAlive == false){
      if(this.element){
      this.element.textContent += "Congratulations, you killed the Wumpus!\r\n";
      }
      this.playAgain();
    }
    else{
      if(this.element){
        this.element.textContent += "You Lose!\r\n" + "GAME OVER!\r\n";
        }
        this.playAgain();
    }
  }

   inspectCurrentRoom() {
    if (this.currentRoom == this.wumpusRoom)
    {
      if(this.element){
       this.element.textContent = "You are in the Wumpus Room!!!\r\n";
      }
      this.playerAlive = false;
      this.showChoices();
    }
    else if (this.currentRoom == this.batRoom1 || this.currentRoom == this.batRoom2)
    {
      this.roomBatsLeft = this.currentRoom;
      if(this.element){
          this.element.textContent = "Snatched by superbats!!\r\n";
        }
        if(this.currentRoom == this.pitRoom1 || this.currentRoom == this.pitRoom2){
          if(this.element){
              this.element.textContent += "Luckily, the bats saved you from the bottomless pit!!\r\n";
            }
          }
        while(!this.batsHere){
            this.currentRoom = this.move(this.rand(0,20) % 20);
            if(this.currentRoom != this.batRoom1 && this.currentRoom != this.batRoom2 && this.currentRoom != this.wumpusRoom
               && this.currentRoom != this.pitRoom1 && this.currentRoom != this.pitRoom2)
                this.batsHere = true;
        }
        this.batsHere = false;
        if(this.element){
            this.element.textContent += "The bats moved you to room " + this.currentRoom;
          }

        if(this.roomBatsLeft == this.batRoom1){
            while(!this.validNewBatRoom){
                this.batRoom1 = this.rand(1,19) % 19;
                if(this.batRoom1 != this.wumpusRoom && this.batRoom1 != this.currentRoom)
                    this.validNewBatRoom = true;
            }
            this.validNewBatRoom = false;
        } 
        else {
            while(!this.validNewBatRoom){
                this.batRoom2 = this.rand(1,19) % 19;
                if(this.batRoom2 != this.wumpusRoom && this.batRoom2 != this.currentRoom)
                    this.validNewBatRoom = true;
            }
            this.validNewBatRoom = false;
        }
        this.unlisten();
        this.inspectCurrentRoom();
    }
    else if(this.currentRoom == this.pitRoom1 || this.currentRoom == this.pitRoom2)
    {
      if(this.element){
      this.element.textContent = "Fell into a pit!!!\r\n";
    }
      this.playerAlive = false;
      this.showChoices();
    }
    else if(this.playerAlive == true && this.wumpusAlive == true)
    {
        if(this.element){
          this.element.textContent +=  "\r\nYou are in room " + this.currentRoom + "\r\n";
        }
        if (this.isRoomAdjacent(this.currentRoom, this.wumpusRoom)){
          if(this.element){
            this.element.textContent += "You smell a horrid stench...\r\n";
          }
        }
        if (this.isRoomAdjacent(this.currentRoom, this.batRoom1) || this.isRoomAdjacent(this.currentRoom, this.batRoom2)){
          if(this.element){
          this.element.textContent +=  "There are bats nearby...\r\n";
        }
        }
        if (this.isRoomAdjacent(this.currentRoom, this.pitRoom1) || this.isRoomAdjacent(this.currentRoom, this.pitRoom2)){
          if(this.element){
            this.element.textContent += "You feel a draft...\r\n";
          }
        }
        if(this.element){
        this.element.textContent += "The tunnels lead to the rooms numbering:\r\n";
        for (var j = 0; j < 3; j++)
        {
          this.element.textContent += this.rooms[this.currentRoom][j] + " ";
        }
        }
        this.showChoices();
        this.waitTime = true;
      }
    }

    waitForPress()  {
        return new Promise(resolve => {this.waitForPressResolve = resolve});
    }

    waitResolve() {
      if (this.waitForPressResolve) {
        this.waitForPressResolve();
      }
    }

   /* async waitInput() {
          I hate angular. The await needs to go directly into the code block.
          It cannot be in a function you call inside same code block.
          this.unlisten = this.renderer.listen(this.butClick.nativeElement, 'click', (event)=>{this.waitResolve()});
              await this.waitForPress();
    }*/

    async performAction(ans:String) {
    //var myAns = this.convertStringToNumber(this.answer);
    debugger;
    switch(ans)
    {
        case 'q':
          var temp = 0;
          this.waitTime = false;
            if(this.element){
              this.element.textContent = "Which room?\r\n";
              for (var j = 0; j < 3; j++)
              {
                this.element.textContent += this.rooms[this.currentRoom][j] + " ";
              }
            }
            while(temp == 0){
            //this.waitInput();
            this.unlisten = this.renderer.listen(this.butClick.nativeElement, 'click', (event)=>{this.waitResolve()});
              await this.waitForPress();
            var newAns = this.convertStringToNumber(this.answer.replace(/[^\/\d]/g,''));
            //alert("newAns " + newAns);
                if (this.isValidMove(newAns))
                {
                    this.currentRoom = this.move(newAns);
                    temp++;
                    this.inspectCurrentRoom();
                }
                else
                {
                  if(this.element){
                    this.element.textContent = "You cannot move there.\r\n";
                    this.element.textContent += "Valid Rooms are:\r\n";
                    for (var j = 0; j < 3; j++)
                    {
                      this.element.textContent += this.rooms[this.currentRoom][j] + " ";
                    }

                  }
                }
              }
              this.unlisten();
            break;
        case 'w':
            if(this.numArrows > 0){
              var temp = 0;
              this.waitTime = false;
              if(this.element){
                this.element.textContent = "Which room?\r\n";
                for (var j = 0; j < 3; j++)
                {
                  this.element.textContent += this.rooms[this.currentRoom][j] + " ";
                }
            }
              while(temp == 0){
              //this.waitInput();
              this.unlisten = this.renderer.listen(this.butClick.nativeElement, 'click', (event)=>{this.waitResolve()});
                await this.waitForPress();
              var newAns = this.convertStringToNumber(this.answer.replace(/[^\/\d]/g,''));  
                    if (this.isValidMove(newAns))
                    {
                      temp++;
                        this.numArrows -= 1;
                        if(newAns == this.wumpusRoom){
                          if(this.element){
                            this.element.textContent = "You hear a noise: 'GRAWR' ... Splat!\r\n";
                          }
                            this.wumpusAlive = false;
                            this.showChoices();
                        }
                        else
                        {
                          if(this.element){
                            this.element.textContent = "Miss!\r\n"
                            this.element.textContent += "Arrows Left: " + this.numArrows;
                            //this.element.textContent += this.numArrows;
                          }
                          this.startleWumpus(this.wumpusRoom);
                            if(this.wumpusRoom == this.currentRoom){
                              if(this.element){
                                this.element.textContent = "The wumpus attacked you! You've been killed.\r\n";
                              }
                                this.playerAlive = false;
                                this.showChoices();
                            }

                        }
                        if(this.numArrows <= 0 && this.wumpusAlive == true){
                          if(this.element){
                            this.element.textContent = "You do not have any arrows left!\r\n" + "You have no choice but to accept your fate.\r\n";
                            this.playerAlive = false;
                            this.showChoices();
                          }
                        }
                        this.inspectCurrentRoom();
                    }
                    else
                    {
                      if(this.element){
                        this.element.textContent = "You cannot shoot there.\r\n";
                        this.element.textContent += "Valid Rooms are:\r\n";
                        for (var j = 0; j < 3; j++)
                        {
                           this.element.textContent += this.rooms[this.currentRoom][j] + " ";
                        }
                      }
                    }
                    this.unlisten();
            } 
            //this.unlisten();
          }
            break;
        case 'e':
            if(this.element){
            this.element.textContent = "Quitting the current game.\r\n";
            }
            this.playerAlive = false;
            this.showChoices();
            break;
        default:
          if(this.element){
            this.element.textContent = "You cannot do that. You can move, shoot, or quit."
          }
          this.waitTime = false;
            break;
          }
}

startleWumpus(newRoom: number){
    var random = this.rand(1,5) % 4;
    if(random != 3){
      this.wumpusRoom = this.rooms[newRoom][random];
      if(this.element){
        this.element.textContent += "\r\nYou hear footsteps! The wumpus is moving!"
      } 
    }
}

placePits() {
  this.pitRoom1 = this.rand(1,20) % 20;
  this.pitRoom2 = this.rand(1,20) % 20;
  while(this.pitRoom1 == this.pitRoom2){
    this.pitRoom1 = this.rand(1,20) % 20;
    this.pitRoom2 = this.rand(1,20) % 20;
  }
}
placeWumpus() {
  var randomRoom = this.rand(1,20) % 20;
  this.wumpusRoom = randomRoom;
  this.wumpusStart = this.wumpusRoom;
}

placeBats(){
  var validRoom = false;
  while(!validRoom){
    this.batRoom1 = this.rand(1,20) % 20;
    if(this.batRoom1 != this.wumpusRoom){
      validRoom = true;
    }

  }
  validRoom = false;
  while(!validRoom){
    this.batRoom2 = this.rand(1,20) % 20;
    if(this.batRoom2 != this.wumpusRoom && this.batRoom2 != this.batRoom1){
      validRoom = true;
    } 
    
  }
}

placeStuff(){
  this.placePlayer();
  this.placeWumpus();
  this.placeBats();
  this.placePits();
}

async playAgain(){
  if(this.element){
    this.element.textContent +=  "Would you like to play again? \r\n'Y?' \r\n";
  }
  this.unlisten = this.renderer.listen(this.butClick.nativeElement, 'click', (event)=>{this.waitResolve()});
              await this.waitForPress();
    if(this.answer.toLowerCase() == 'y'){
      if(this.element){
        this.element.textContent =  "";
      }
        this.placeStuff();
        this.inspectCurrentRoom();
    } else {
      if(this.element){
        this.element.textContent =  "Thanks for playing!!";
      }
    }
    this.unlisten();
}

 convertStringToNumber(input: string) {
    if (!input) {
      return NaN;
    }
    if (input.trim().length == 0) {
        return NaN;
    }
    return Number(input);
}

ngOnDestroy() {
  this.unlisten();
  }

}
