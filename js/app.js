angular.module('app',[])
.config(function($sceProvider) {
  $sceProvider.enabled(false);
})
.controller('IndexController',function($scope,$interval){
$scope.personagem = new Ser("Goliath",5,3,4,['bruto','humano'],[doAtaque()]);
$scope.inimigo = new Ser("Orck",5,3,4,['bruto','orck'],[doAtaque()]);
$scope.textos="";
function addTexto(txt){
    if(txt.indexOf("<p ")==-1){
        txt="<p>"+txt+"</p>"
    }
    $scope.textos+=txt;
}    
   $scope.atacar=function(){
        var ordem=[];
        if($scope.inimigo.agilidade>$scope.personagem.agilidade){
           ordem=[$scope.inimigo,$scope.personagem];
        } else{
           ordem=[$scope.personagem,$scope.inimigo];
        }
       
       var interval={};
        interval=$interval(function(){
       //while($scope.inimigo.vida>0&&$scope.personagem.vida>0){
          addTexto(ordem[0].ataques[0].atacar(ordem[1]));
          ordem.reverse()
        //}
       
           if($scope.inimigo.vida<0){
              addTexto("<b>"+$scope.personagem.nome+"</b> derrotou <b>"+$scope.inimigo.nome+"</b>!")
              $interval.cancel(interval);
           }else if($scope.personagem.vida<0){
              addTexto("<b>"+$scope.inimigo.nome+"</b> derrotou <b>"+$scope.personagem.nome+"</b>!")
              $interval.cancel(interval);
           }       
       },1000)
       
        
   }
   $scope.descricao=function(){
    return $scope.textos;
   }
    
    
})