var datas, options, timer;
window.document.getElementById("block4").onmouseover = launch;
function launch(e) {
  e.currentTarget.onmouseover = null;

  /* Config -------------------------------------------------------------------------------------------------------------------------------------------------
  Config Dossier contenant les fichiers data et options. */
  (function loadDataOptions (){
    var dossierData = getRootPath() + "Assets/data/";
    // Chargement des fichiers stats et options.
    datas = getFileData(dossierData + "stats.json");
    options = getFileData(dossierData + "chartOptions.json");
    setResizeEvent();
  })();


  /*Evenements -----------------------------------------------------------------------------------------------------*/
  // gestion du resizing.
  function setResizeEvent () {
    window.onresize = function () {
        if (timer) {
            timer = clearTimeout();
        }
        timer = setTimeout(drawGraph, 100);
    };
  }

  // Démarrage
  drawGraph();

  //Fonctions ---------------------------------------------------------------------------------------------------------------------------------------
  function drawGraph() {
      //Graphe 1
      // Initialisation des données et options.
      var data1 = google.visualization.arrayToDataTable(initializeChartData(datas, options, 1));
      var data2 = google.visualization.arrayToDataTable(initializeChartData(datas, options, 2));
      // Selection des conteneurs des graphes
      var chart1 = new google.visualization.ColumnChart(document.getElementById('graph1'));
      var chart2 = new google.visualization.ColumnChart(document.getElementById('graph2'));
      // Traçage des graphes.
      chart1.draw(data1, options.optionChartRecrutement);
      chart2.draw(data2, options.optionChartReussite);
      //Clear timer if set
      if (timer) {
          timer = clearTimeout();
      }
  }

  // fonction d'initialisation des données et options.
  function initializeChartData(datas, options, graphOrder) {
      var tableau = new Array();
      // Création du tableau de données
      if (datas && options) {
          if (graphOrder == 1) {
              var recrutementKeys = Object.keys(datas.employés_6_mois);
              tableau.push(['Année', 'Taux de recrutement', { role: 'style' }]);
              for (var i = 0; i < recrutementKeys.length; i++) {
                  var sousTableau = [recrutementKeys[i]];
                  sousTableau.push(datas.employés_6_mois[recrutementKeys[i]] / datas.accessions[recrutementKeys[i]]);
                  var colorIndex = i - Math.trunc(i / options.couleurs1.length) * (options.couleurs1.length);
                  sousTableau.push("color: " + options.couleurs1[colorIndex]);
                  tableau.push(sousTableau);
              }
          }
          else if (graphOrder == 2) {
              var presentationsKeys = Object.keys(datas.présentations);
              tableau.push(['Année', 'Taux de réussite Complète', 'Taux de réussite partielle'])
              for (var i = 0; i < presentationsKeys.length; i++) {
                  var sousTableau = [presentationsKeys[i]];
                  sousTableau.push(datas.accessions[presentationsKeys[i]] / datas.présentations[presentationsKeys[i]]);
                  sousTableau.push(datas.accessions_partielles[presentationsKeys[i]] / datas.présentations[presentationsKeys[i]]);
                  tableau.push(sousTableau);
              }
          }
      }
      return tableau;
  }

  // Fonction de chargement des fichiers.
  function getFileData(pathToFile) {
      var data;
      // Création d'un objet XMlHttRequest.
      var xmlHttp = new XMLHttpRequest();
      // Fonction de Traitement de la reponse sur evenement readyStateChange
      xmlHttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
              data = JSON.parse(this.responseText);
          }
          else if (this.readyState == 4 && this.status == 404) {
              data = null;
          }
      }
      // Envoi de la requête.
      xmlHttp.open("GET", pathToFile, false);
      xmlHttp.send();
      return data;
  }
  // Fonction utilitaire de récupération de l'url relative.
  function getRootPath() {
      var rootPath = "..";
      var rootPathParts = (window.location.pathname).split("/");
      for (var i = 0; i < rootPathParts.length - 1; i++) {
          rootPath += rootPathParts[i] + "/";
      }
      return rootPath;
  }
};
