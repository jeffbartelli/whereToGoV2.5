import {metricDetails, cityList} from './data.js';
import {data, weightUpdate, weightedCalc, overallScore, overallRank, dataKeys} from './rankings.js';

let numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// TOP30 LIST
let cityRankings = () => {
  const rankSet = document.createElement('div');
  const rankItem = document.createElement('div');
  for (let j=1;j<4;j++) {
    rankSet.setAttribute('id',"rank"+j*10);
    document.getElementById('rankings').appendChild(rankSet.cloneNode(true));
    for (let i=1; i<11; i++) {
      rankItem.setAttribute('id',((j*10-10) + i));
      rankItem.innerHTML = (j*10-10) + i + '. ';
      document.getElementById("rank"+j*10).appendChild(rankItem.cloneNode(true));
    }
  }
}

let metricHead;
let metricContent;
let sectionHead;
// INDIVIDUAL METRIC TEMPLATE FOR CLONING. INCLUDES TWO NODES
let sectionNode = () => {
  // sectionHead
  sectionHead = document.createElement('div');
  sectionHead.setAttribute('class','sectionHead');
  const sectionLabel = document.createElement('label');
  sectionLabel.setAttribute('class','sectionLabel');
  sectionHead.appendChild(sectionLabel);
  const switcher = document.createElement('label');
  switcher.setAttribute('class','switch');
  sectionHead.appendChild(switcher);
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type','checkbox');
  checkbox.setAttribute('class','checker');
  checkbox.setAttribute('onchange','toggleFunctionSections(this)');
  checkbox.setAttribute('value','');
  checkbox.checked = true;
  switcher.appendChild(checkbox);
  const slider = document.createElement('span');
  slider.setAttribute('class','slider round');
  switcher.appendChild(slider);
  // metricHead
  metricHead = document.createElement('div');
  metricHead.setAttribute('class','metricHead');
  const expand = document.createElement('button');
  expand.setAttribute('class','expandSection');
  expand.setAttribute('type','button');
  expand.innerHTML = '+';
  metricHead.appendChild(expand);
  const name = document.createElement('label');
  name.setAttribute('class','name');
  name.innerHTML = '[Metric Name]';
  metricHead.appendChild(name);
  metricHead.appendChild(switcher.cloneNode(true));
  const number = document.createElement('input');
  number.setAttribute('type','number');
  number.setAttribute('value','100');
  number.setAttribute('max','100');
  number.setAttribute('min','0');
  number.setAttribute('maxlength','3');
  number.setAttribute('onchange','weightFunction(this)');
  number.setAttribute('class','weight');
  number.setAttribute('required','');
  metricHead.appendChild(number);
  // metricContent
  metricContent = document.createElement('div');
  metricContent.setAttribute('class','metricContent');
  const description = document.createElement('label');
  description.setAttribute('class','description');
  description.innerHTML = 'Description...';
  metricContent.appendChild(description);
  const source = document.createElement('label');
  source.setAttribute('class','source');
  metricContent.appendChild(source);
  let sourceLink = document.createElement('a');
  sourceLink.setAttribute('href','#');
  sourceLink.setAttribute('target','_blank');
  sourceLink.innerHTML = 'Source';
  source.appendChild(sourceLink);
  const top10 = document.createElement('span');
  top10.setAttribute('class','top10');
  top10.innerHTML = '?';
  metricContent.appendChild(top10);
  // metricContent > Top 10 PopUp
  const top10List = document.createElement('ul');
  top10List.setAttribute('class','top10List');
  const popUpTitle = document.createElement('li');
  popUpTitle.innerHTML = 'Top 10';
  popUpTitle.setAttribute('class','popUpTitle');
  top10List.appendChild(popUpTitle);
  for(let i=0;i<10;i++){
    let x =document.createElement('li');
    x.setAttribute('class','top10Item'+(i+1));
    x.innerHTML = 'text';
    top10List.appendChild(x);
  };
  top10.appendChild(top10List);
  // metricContent > end Top 10 popUp
  const rank = document.createElement('label');
  rank.setAttribute('class','rank');
  rank.innerHTML = 'Rank: '
  metricContent.appendChild(rank);
  const rankVal = document.createElement('span');
  rankVal.innerHTML = '[]';
  rank.appendChild(rankVal);
  const score = document.createElement('label');
  score.setAttribute('class','score');
  score.innerHTML = '[score]';
  metricContent.appendChild(score);
  const scoreLabel = document.createElement('div');
  scoreLabel.setAttribute('class','scoreLabel');
  metricContent.appendChild(scoreLabel);
}


let sectionPopulator = () => {
  let sectionList = Array.from(document.getElementById('metricContainer').children);
  for (let j=0;j<sectionList.length;j++){
    sectionList[j].insertBefore(sectionHead.cloneNode(true), sectionList[j].firstChild);
    document.querySelector('[id=' + sectionList[j]['id'] + '] .sectionLabel').innerHTML = sectionList[j]['id'];
    
    let metricItem = Array.from(document.querySelector('[id=' + sectionList[j]['id'] + '] .sectionContent').children);
    if(sectionList[j]['id'] == 'profile'){
      for(let i=0;i<5;i++){
        metricItem[i].innerHTML = metricDetails.filter((el)=>{
          return el.id == metricItem[i]['id'];
        })[0]['metricName'] + ': ';
      }
    }
    let i;
    sectionList[j]['id'] == 'profile' ? i=5 : i=0;
    for (i; i<metricItem.length; i++) {
      metricItem[i].appendChild(metricHead.cloneNode(true));
      metricItem[i].appendChild(metricContent.cloneNode(true));
      let newArray = metricDetails.filter((el)=>{
        return el.section == sectionList[j]['id'] &&
        el.id == metricItem[i]['id'];
      });
      metricItem[i].querySelector('.name').innerHTML = newArray[0]['metricName'];
      metricItem[i].querySelector('.weight').value = newArray[0]['weight'];
      metricItem[i].querySelector('.checker').value = newArray[0]['active'];
      metricItem[i].querySelector('.description').innerHTML = newArray[0]['description'];
      metricItem[i].querySelector('.source > a').setAttribute('href',newArray[0]['source']);
      metricItem[i].querySelector('.scoreLabel').innerHTML = newArray[0]['scoreLabel'];
      metricItem[i].querySelector('.checker').setAttribute('onchange','toggleFunction(this)');
      metricItem[i].querySelector('.metricHead button').setAttribute('class','expandMetric');
      let rankArray = [];
      for(let n=0; n<data.length;n++){
        let newArray2 = [];
        newArray2.push(data[n][metricItem[i]['id']][1]); 
        // newArray2.push(data[n][metricItem[i]['id']][0]);
        newArray2.push(data[n].city[0]);
        newArray2.push(data[n].state[0]);
        rankArray.push(newArray2);
      };
      rankArray.sort((a,b)=>{
        return a[0] - b[0];
      });
      rankArray = rankArray.slice(0,10);
      for(let m=0;m<10; m++){
        metricItem[i].querySelector('.top10Item'+(m+1)).innerHTML = rankArray[m][0] + ". " + rankArray[m][1] + ", " + rankArray[m][2];
      };
      rankArray = [];
    };
  };
  const profileTop = document.createElement('div');
  profileTop.setAttribute('id','profileTop');
  document.querySelector('#profile .sectionContent').insertBefore(profileTop,document.querySelector('#profile .sectionContent').firstChild);
  profileTop.appendChild(document.querySelector('#city'));
  profileTop.appendChild(document.querySelector('#state'));
  profileTop.appendChild(document.querySelector('#cityPop'));
  profileTop.appendChild(document.querySelector('#metroPop'));
  profileTop.appendChild(document.querySelector('#popDensity'));
  let dropdown = document.createElement('div');
  dropdown.setAttribute('class','dropdown');
  document.querySelector('#city').appendChild(dropdown);
  let dropdownContent = document.createElement('select');
  dropdownContent.setAttribute('id','cityDropdown');
  dropdownContent.setAttribute('onchange','dropdownChange()');
  document.querySelector('.dropdown').appendChild(dropdownContent);
  let dropdownPrompt = document.createElement('option');
  dropdownPrompt.innerHTML = 'Select A City';
  dropdownContent.appendChild(dropdownPrompt);
  let dropdownItems = document.getElementById('cityDropdown');
  for(let i =0;i<cityList.length;i++){
    let cities = cityList[i];
    var el = document.createElement('option');
    el.textContent = cities;
    el.value = cities;
    dropdownItems.appendChild(el);
  }
  let switches = document.querySelectorAll('.metricHead .switch .checker');
  let weights = document.querySelectorAll('.metricHead .weight');
  for (let i=0; i<switches.length; i++){
    switches[i].setAttribute('id',document.querySelectorAll('.metricHead')[i].parentNode.id + 1);
    weights[i].setAttribute('id',document.querySelectorAll('.metricHead')[i].parentNode.id + 2);
  }
  document.querySelector('#state').style.display = "none";
}


window.dropdownChange = function() {
  let e = document.getElementById('cityDropdown');
  localStorage.setItem('dropdownCity',e.value);
  let g = e.value.split(', ');
  const cityRecord = data.filter((f)=>{
    return f.city.includes(g[0]) &&
           f.state.includes(g[1]);
  })
  document.getElementById('cityPop').innerHTML = 'City Population: ' + numberWithCommas(cityRecord[0].cityPop[0]);
  document.getElementById('metroPop').innerHTML = 'Metro Population: ' +  numberWithCommas(cityRecord[0].metroPop[0]);
  document.getElementById('popDensity').innerHTML = 'City Density: ' + numberWithCommas(cityRecord[0].popDensity[0]) + '/sq mile';
  for(let i=5;i<dataKeys.length-1;i++){
  document.querySelector('[id=' + [dataKeys[i]][0] + '] .rank span').innerHTML = cityRecord[0][dataKeys[i]][1];
  let temp = document.querySelector('[id=' + [dataKeys[i]][0] + '] .score');
  if (cityRecord[0][dataKeys[i]][0] < 1) {
    temp.innerHTML = (cityRecord[0][dataKeys[i]][0] * 100).toFixed(1) + "%";
  } else { temp.innerHTML = cityRecord[0][dataKeys[i]][0];}
  }
}


window.persistValues = function() {
  if(localStorage.getItem('dropdownCity')){
    document.getElementById('cityDropdown').value=localStorage.getItem('dropdownCity');
    dropdownChange();
  }
  for(let i=0;i<metricDetails.length; i++) {
    let metricSwitch = document.querySelector('[id=' + metricDetails[i]['id'] + '] .checker');
    if(localStorage.getItem(metricDetails[i]['id'] + '-' + 'active')) {
      let retrieveActive = localStorage.getItem(metricDetails[i]['id'] + '-' + 'active');
      metricDetails.filter((f)=>{
        return f.id.includes(metricDetails[i]['id']);
      })[0]['active'] = retrieveActive;
      if (retrieveActive == 1) {
        metricSwitch.value = 1;
        metricSwitch.checked = true;
      } else if (retrieveActive == 0) {
        metricSwitch.value = 0;
        metricSwitch.checked = false;
      }
    }
    let metricWeight = document.querySelector('[id=' + metricDetails[i]['id'] + '] .weight');
    if(localStorage.getItem(metricDetails[i]['id'] + '-' + 'weight')) {
      let retrieveWeight = localStorage.getItem(metricDetails[i]['id'] + '-' + 'weight');
      metricDetails.filter((f)=>{
        return f.id.includes(metricDetails[i]['id']);
      })[0]['weight'] = retrieveWeight;
      metricWeight.value = parseInt(retrieveWeight,10);
      let metricPush = {
        id: metricDetails[i]['id'],
        value: metricWeight.value 
      }
      weightUpdate(metricPush);
    }
  }
}


window.toggleFunction = function(e) {
  let localActive = e.id.replace(/\d+$/,'') + '-active';
    if(e.checked === true) {
    metricDetails.filter((f)=>{
      return f.id == e.parentNode.parentNode.parentNode.id;
    })[0]['active'] = 1;
    localStorage.setItem(localActive,1);
    e.value = 1;
  } else {
    metricDetails.filter((f)=>{
      return f.id == e.parentNode.parentNode.parentNode.id;
    })[0]['active'] = 0;
    localStorage.setItem(localActive,0);
    e.value = 0;
  };
  overallScore();
  overallRank();
  topRanks();
};


window.toggleFunctionSections = function(e) {
  let localActive = e.parentNode.parentNode.parentNode.id + "-active";
  let childSwitches = (e.parentNode.parentNode.nextElementSibling).getElementsByClassName('checker');
  if(e.checked === true) {
    localStorage.setItem(localActive,1);
    for(let i=0; i<childSwitches.length; i++){
      metricDetails.filter((f)=>{
        return f.id.includes(childSwitches[i].id.replace(/\d+$/,''));
      })[0]['active'] = 1;
      childSwitches[i].value = 1;
      childSwitches[i].checked = true;
    }
  } else {
    localStorage.setItem(localActive,0);
    for(let i=0; i<childSwitches.length; i++){
      metricDetails.filter((f)=>{
        return f.id.includes(childSwitches[i].id.replace(/\d+$/,''));
      })[0]['active'] = 0;
      childSwitches[i].value = 0;
      childSwitches[i].checked = false;
    };
  };
  overallScore();
  overallRank();
  topRanks();
}


window.weightFunction = function(e) {
  let localActive = e.id.replace(/\d+$/,'') + '-weight';
  metricDetails.filter((f)=>{
    return f.id == e.parentNode.parentNode.id;
  })[0]['weight'] = parseInt(e.value,10);
  localStorage.setItem(localActive,parseInt(e.value,10));
  weightUpdate(e);
};


let topRanks = () => {
  let rankFill = [];
  let finalRank = [];
  for(let i=0;i<data.length;i++){
    rankFill.push(data[i][dataKeys[0]][0]);
    rankFill.push(data[i][dataKeys[1]][0]);
    rankFill.push(data[i][dataKeys[0]][2]);
    finalRank.push(rankFill);
    rankFill = [];
  }
  finalRank.sort((a,b)=>{
    if ( a[2] == b[2]) return 0;
    return a[2] < b[2] ? -1 : 1;
  });
  for(let i=0;i<30;i++){
    document.getElementById(i+1).innerHTML = (i+1) + ". " + finalRank[i][0] + ", " + finalRank[i][1];
  }
}


cityRankings();
sectionNode();
sectionPopulator();
persistValues();
topRanks();


let sectColl = document.getElementsByClassName('expandMetric');

for (let i=0; i<sectColl.length; i++){
  sectColl[i].addEventListener("click", function() {
    this.classList.toggle('active');
    let content = this.parentNode.nextElementSibling;
    let test = this.parentNode.nextElementSibling.querySelector('.top10');
    if (content.style.maxHeight){
      content.style.maxHeight = null;
      test.style.opacity = 0;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
      test.style.opacity = 1;
    }
  });
}


export {metricDetails} from './data.js';
export {topRanks};