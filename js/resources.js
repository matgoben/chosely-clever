
var NORMAL='n';
var MAGICO='m';
var AGIL='a';

function Ser(nome,forca,inteligencia,agilidade,propiedades,ataques){
    var me = this;
    this.nome=nome;
    
    this.forca=forca;
    this.inteligencia=inteligencia;
    this.agilidade=agilidade;
    
    this.maxVida=function(){
      return  100+(me.forca*10)+(me.forca>10?(me.forca-10)*(me.forca-10):0);
    }
    this.maxMana=function(){
      return  50+(me.inteligencia*20)+(me.inteligencia>5?(me.inteligencia-2)*(me.inteligencia-2):0);
    }
    this.maxEnergia=function(){
      return  80+(me.agilidade*me.forca*5)+(this.agilidade*this.agilidade)+(this.agilidade+this.inteligencia);
    }
    
    this.vida = me.maxVida();
    this.mana = me.maxMana();
    this.energia = me.maxEnergia();    
    
    this.propiedades=propiedades;
    
    this.ataques=[];
    this.addAtaque=function(a){
        a.me=me;
        this.ataques.push(a);
    }
    if(ataques){
        for(var x in ataques){
            this.addAtaque(ataques[x]);
        }
    }
   var getMod=function(tipo){
    if(tipo==MAGICO){
        return floor((me.maxMana()/100)/10);
    }else if(tipo==AGIL){
        return floor((me.maxEnergia()/50)/10);
    }else if(tipo==NORMAL){
        return floor((me.maxVida()/80)/10);
    }      
   }
    
   this.getOffense=getMod;
   this.getDefense=getMod;
}

function Ataque(titulo,descricao,tipo,func,poder,requisitos,forteContra,fracoContra,aleatorioContra,inutilContra,curaContra){
    this.me;
    var auto = this;
    this.titulo=titulo;
    this.tipo=tipo;
    this.descricao=descricao;
    this.experience=0;
    this.poder=poder;
    this.func=func;
    this.requisitos=requisitos;
    
    this.forteContra=forteContra;
    this.fracoContra=fracoContra;
    this.aleatorioContra=aleatorioContra;
    this.inutilContra=inutilContra;
    this.curaContra=curaContra;
    
    function compareEfectsPropieties(arr,foe,func){
       
        for(var y in arr){
            for(var x in foe.propiedades){
                 
                if(auto.forteContra[y]==foe.propiedades[x]){
                    func(auto.forteContra[y])
                }
            }
        }
     }   
    this.atacar=function(foe){
        var poder = auto.poder;
        var inicial = poder;
        var modificador={}
        if(random(1000)>((1000-foe.agilidade)+auto.me.agilidade)){
            return "<b>"+foe.nome+"</b> se esquivou agilmente do ataque de <b>"+auto.me.nome+"</b>!"
        }
        
        for(var i in auto.requisitos){
             if(auto.requisitos[i](auto,foe)!=true){
                 return auto.requisitos[i](auto,foe);
             }
        }
        
        if(auto.me.getOffense(auto.tipo)){
            poder+=floor(auto.me.getOffense(auto.tipo)*0.9);
        }
        
        if(poder>0&&foe.getDefense(auto.tipo)){
            poder-=floor(foe.getDefense(auto.tipo)*0.1);
        }
        
       var forte=false;
       var fraco=false;
       var aleatorio=false;
       var inutil=false;
       var cura=false;
        compareEfectsPropieties(auto.forteContra,foe,function(prop){
            poder+=floor(inicial/2);
            forte=true;
        })
        compareEfectsPropieties(auto.fracoContra,foe,function(prop){
            poder-=floor(inicial/2);
            fraco=true;
        })
        compareEfectsPropieties(auto.aleatorioContra,foe,function(prop){
            poder=(random(inicial+poder+1)-random(inicial+poder+1));
            aleatorio=true;
        })
        compareEfectsPropieties(auto.inutilContra,foe,function(prop){
            poder=0;
            aleatorio=true;
        })
        compareEfectsPropieties(auto.curaContra,foe,function(prop){
            if(poder>0||inicial<0){
                poder*=(-1)
            };
            cura=true;
        })
        if(poder>0&&foe.getDefense(auto.tipo)){
            poder-=floor(foe.getDefense(auto.tipo)*0.9);
        }
        if(auto.me.getOffense(auto.tipo)){
            poder+=floor(auto.me.getOffense(auto.tipo)*0.1);
        }
        
        
        return this.func(auto.me,foe,poder);
        
    }
}
function doAtaque(){
   return new Ataque("ataque","Um ataque simples",NORMAL,function(me,foe,poder){
       foe.vida-=poder;
       return "<p class='falha'><b>"+me.nome+"<b> golpeou <b>"+foe.nome+"</b>, causando "+poder+"pts de dano.</p>";
   },20,[],['orck'])
}

function floor(i){
    return Math.floor(i);
}
function random(i){
    return Math.floor((Math.random()*i)+1);
}
