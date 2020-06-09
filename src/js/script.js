new Vue({
  el: "#app",
  // 変数、定数入れ
  data: {
    datas: "",
    region: "",
    searchResults: "",
    infectionRate: "",
    comparisonSource: "",
    comparisonSourceData:"",
    comparisonDestination: "",
    comparisonDestinationData:"",
    searchCases: {
      Number: '0',
      upAndDown: '以上',
    },
    searchDeaths: {
      Number: '0',
      upAndDown: '以上',
    },
    searchPcr: {
      Number: '0',
      upAndDown: '以上',
    },
    resultData: [],
    comparisonResults: {
        cases: '',
        deaths: '',
        pcr: '',
    },
    regions: [
      {
        regionName: '北海道地方',
        place: ['北海道']
      },
      {
        regionName: '東北地方',
        place: ['青森', '岩手', '宮城', '秋田', '山形', '福島']
      },
      {
        regionName: '関東地方',
        place: ['東京', '神奈川', '埼玉', '千葉', '茨城', '栃木', '群馬']
      },
      {
        regionName: '中部地方',
        place: [
          '山梨',
          '新潟',
          '長野',
          '富山',
          '石川',
          '福井',
          '愛知',
          '岐阜',
          '静岡'
        ]
      },
      {
        regionName: '近畿地方',
        place: ['三重', '大阪', '兵庫', '京都', '滋賀', '奈良', '和歌山']
      },
      {
        regionName: '中国地方',
        place: ['鳥取', '島根', '岡山', '広島', '山口']
      },
      {
        regionName: '四国地方',
        place: ['徳島', '香川', '愛媛', '高知']
      },
      {
        regionName: '九州地方',
        place: ['福岡', '佐賀', '長崎', '熊本', '大分', '宮崎', '鹿児島', '沖縄']
      }
    ],
  },

  // 変数として返す。
  // ファンクションの呼び出し先にすると上手く動かない。
  computed: {
    // test: function() {
    //   return this.test * 2;
    // }
  },

  watch: {
    region: function() {
      this.searchResults = this.datas.find(data => data.name_ja === this.region);
      this.infectionRate = Math.round((this.searchResults.cases / this.searchResults.population) * 100000)/ 1000;
    },
    comparisonSource: function() {
      this.comparisonInputCheck();
    },
    comparisonDestination: function() {
      this.comparisonInputCheck();
    },
  },

  // 最初に一回だけ処理を行う
  beforeCreate(){
    // 一覧情報の取得
    fetch('https://covid19-japan-web-api.now.sh/api/v1/prefectures')
    .then(response => response.json())
    .then(data => {this.datas = data;});
  },

  // ファンクション入れ
  methods: {
    // 比較元・先双方を入力したか。
    comparisonInputCheck: function() {
      if(this.comparisonSource !== "" && this.comparisonDestination !== ""){
        const sourceData = this.datas.find(data => data.name_ja === this.comparisonSource);
        const destinationData = this.datas.find(data => data.name_ja === this.comparisonDestination);
        this.comparisonResults.cases = (sourceData.cases - destinationData.cases)
        this.comparisonResults.deaths = (sourceData.deaths - destinationData.deaths)
        this.comparisonResults.pcr = (sourceData.pcr - destinationData.pcr)
      }
    },

    // 条件に合致したデータを返却
    startSearch: function(){
      // データの初期化
      this.resultData.splice(0);

      this.datas.forEach((data, i) => {
        // 感染者数
        if(this.conditionalCheck(this.searchCases, data.cases)
        && this.conditionalCheck(this.searchDeaths, data.deaths)
        && this.conditionalCheck(this.searchPcr, data.pcr)){
          this.resultData.push([data.name_ja, data.cases, data.deaths, data.pcr])
        }
      })
    },

    upAndDownCheck: function(upOrDown) {
      switch (upOrDown){
        case '以上':
          return true;
        case '以下':
          return false;
      }
    },

    conditionalCheck: function(conditionalSearchInfo, checkNumber) {
      // 条件に一致した場合、trueを返却する。
      if(this.upAndDownCheck(conditionalSearchInfo.upAndDown)){
        if(conditionalSearchInfo.Number <= checkNumber){
          return true;
        }
      }else if(conditionalSearchInfo.Number >= checkNumber){
        return true;
      }
      return false;
    }

  },

  // vue処理後に実行するメソッド
  mounted() {
  }
})