<template>
  <div @click.stop
       class="sudoku">
    <div id="content">
      <table>
        <tr class="table-tr"
            v-for="trIndex of lineArr"
            :key="trIndex"
            :class="trIndex === currentRow ? 'current-bg' : ''">
          <td @click="currentSelect && initArr[trIndex][tdIndex] == 0 ? handleClick(trIndex + tdIndex) : ''"
              :id="trIndex + tdIndex"
              v-for="tdIndex of lineArr"
              :class="['table-td', tdIndex === currentCol ? 'current-bg' : '', currentSelect ? 'is-pointer':'']"
              :key="tdIndex">
            <span v-show="initArr[trIndex][tdIndex] != 0">{{ initArr[trIndex][tdIndex] }}</span>
          </td>
        </tr>
      </table>

      <div class="select-content">
        <span v-for="item of [1, 2, 3, 4, 5, 6, 7, 8, 9]"
              :key="item"
              :class="['select-item', item == currentSelect ? 'current-bg' : '']"
              @click="handleSelect(item)">{{ item }}</span>
      </div>

      <div class="tip-area">
        <p>Now Select: {{currentSelect}}</p>
      </div>

      <!-- button area -->
      <div class="btn-area">
        <button class="el-button"
                @click="handleSubmit">submit</button>
        <button class="el-button"
                @click="handleClear">clear</button>
      </div>
    </div>
  </div>
</template>

<script>
import solveSudoku from "@/utils/sudoku.js";
export default {
  data() {
    return {
      initArr: [[], [], [], [], [], [], [], [], []],
      backUpArr: [[], [], [], [], [], [], [], [], []],
      currentCol: null,
      currentRow: null,
      currentSelect: null,
      isComplete: null,
      answerArr: [[], [], [], [], [], [], [], [], []]
    };
  },
  created() {
    this.createSudoku();
  },
  computed: {
    lineArr() {
      let temp = [];
      for (let i = 0; i < 9; i++) {
        temp.push(i.toString());
      }
      return temp;
    }
  },
  methods: {
    handleClick(e) {
      let index = e.split("")
      document.getElementById(e).innerText = this.currentSelect
      this.currentRow = index[0];
      this.currentCol = index[1];
    },
    createSudoku() {
      let ranArr = this.randomCreateSudoko().join('') + '000000000000000000000000000000000000000000000000000000000000000000000000'
      let sudoku = {
        numbers: ranArr
      }
      let result = solveSudoku(sudoku).numbers
      this.isComplete = solveSudoku(sudoku).complete
      this.initArr = this.changeFormat(result)

      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 8; j++) {
          let index = this.getRandomInt(9)
          this.initArr[i][index] = 0
        }
      }
    },
    getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    },
    randomCreateSudoko() {
      let map = new Map()
      let arr = []
      for (let i = 0; i < 9; i++) {
        map.set(i, false)
      }

      while (arr.length <= 9) {
        let ran = this.getRandomInt(9)
        if (arr.length >= 4) {
          for (let i = 0; i < 9; i++) {
            if (!map.get(i)) {
              arr.push(i)
            }
          }
          break;
        }
        if (!map.get(ran)) {
          map.set(ran, true)
          arr.push(ran)
        }
      }
      return arr
    },
    init() {
      let init = "";
      init += "008309100";
      init += "900060004";
      init += "007504800";
      init += "036000540";
      init += "001000600";
      init += "042000970";
      init += "005907300";
      init += "600010008";
      init += "004608200";

      let temp = init.split("");
      for (let i = 0; i < 81; i++) {
        let x = parseInt(i / 9);
        let y = i % 9;
        this.initArr[x][y] = parseInt(temp[i]); // init array
        this.backUpArr[x][y] = parseInt(temp[i]); // back up array
      }
      this.blockCheck(this.initArr, 1);
    },
    //判断一个数组是否有重复的值(值为0的除外)
    // 一维数组检查是否有重复
    isRepeat(arr) {
      let hash = new Map();
      for (let i in arr) {
        if (hash.get(arr[i])) return true;
        if (hash.get(arr[i]) != 0) {
          hash.set(arr[i], true);
        }
      }
      return false;
    },
    //判断数组之和是否为非45
    isAll(arr) {
      let sum = 0;
      for (let item of arr) {
        sum += item;
      }
      return sum == 45 ? false : true;
    },
    //arr 待检测的组数
    //type=1只检是否有重复;type=2检测是否和为非45;type=3 是否有重复 和 非45 都检测
    //如果返回真则数独不成立
    check(arr, type) {
      switch (type) {
        case 1:
          return this.isRepeat(arr);
        case 2:
          return this.isAll(arr);
        case 3:
          return this.isAll(arr) || this.isRepeat(arr);
      }
    },
    //行检测(有没有重复数据)
    //参数 arr数独二维数组
    //没有重复数据返回 true,有重复数据返回 false
    rowsCheck(arr, type) {
      for (let item of arr) {
        if (this.check(item, type)) {
          return false;
        }
      }
      return true;
    },
    //列检测(有没有重复数据)
    //参数 arr数独二维数组
    //没有重复数据返回 true,有重复数据返回 false
    // 二维数组循环检查一维数组
    colsCheck(arr, type) {
      let tmparr = [[], [], [], [], [], [], [], [], []];
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          tmparr[i][j] = arr[j][i];
        }
        // if (this.check(tmparr[i], type)) {
        //   return false
        // }
        if (this.rowsCheck(tmparr[i], type)) {
          return false;
        }
      }
      return true;
    },
    //列检测(有没有重复数据)
    //参数 arr数独二维数组
    //没有重复数据返回 true,有重复数据返回 false
    // 将块级九宫换排序为一维数组，再用check方法检查块级九宫是否符合
    blockCheck(arr, type) {
      let tmparr = [[], [], [], [], [], [], [], [], []];
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          let x = parseInt(i / 3) * 3;
          let y = (i % 3) * 3;
          x = x + parseInt(j / 3);
          y = y + (j % 3);
          tmparr[i][j] = arr[x][y];
        }
        if (this.check(tmparr[i], type)) {
          return false;
        }
      }
      return true;
    },
    // type=1 检测一个未完成的数独是否合法
    // type=3 检测一个完成的数独是否成立
    // 返回 true 合法 或 成立
    allCheck(arr, type) {
      return (
        this.rowsCheck(arr, type) &&
        this.colsCheck(arr, type) &&
        this.blockCheck(arr, type)
      );
    },
    // clear background
    clearBg() {
      this.currentCol = this.currentRow = this.currentSelect = null;
    },
    // handle select number
    handleSelect(currentSelect) {
      this.currentSelect = currentSelect;
    },
    // change array format: One-dimensional to Two-dimensional
    changeFormat(str) {
      let arr = []
      let tempArr = [str[0].toString()]
      for (let i = 1; i < 81; i++) {
        if (i % 9 == 0) {
          arr.push(tempArr)
          tempArr = []
        }
        if (i === 80) {
          tempArr.push(str[i].toString())
          arr.push(tempArr)
          tempArr = []
        }
        tempArr.push(str[i].toString())
      }
      return arr
    },
    handleSubmit() {
      let initArr = []
      for (let i = 0; i < 9; i++) {
        let tempArr = []
        for (let j = 0; j < 9; j++) {
          if (document.getElementById(i.toString() + j).innerText == '') {
            tempArr.push('0')
          } else {
            tempArr.push(document.getElementById(i.toString() + j).innerText)
          }
        }
        initArr.push(tempArr)
        tempArr = []
      }
      if (!Array.prototype.equar(this.initArr, this.answerArr)) {
        alert('fail')
      } else {
        alert('success')
      }
    },
    handleClear() {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          document.getElementById(i.toString() + j).innerText = this.initArr[i][j] == 0 ? '' : this.initArr[i][j]
        }
      }
      this.clearBg()
    }
  }
};
</script>

<style lang="scss" scoped>
.sudoku {
  width: 175px;
  #content {
    position: relative;
    .current-bg {
      background-color: rgba($color: #000, $alpha: 0.2);
    }
    .table-tr {
      display: flex;
      .table-td {
        width: 15px;
        height: 15px;
        font-size: 12px;
        border: 1px solid black;
      }
    }
    .select-content {
      display: flex;
      justify-content: space-around;
      cursor: pointer;
      .select-item {
        width: 20px;
        height: 15px;
        display: inline-table;
      }
    }
    .is-pointer {
      cursor: pointer;
    }
    .tip-area {
      width: 165px;
      height: 15px;
      position: absolute;
      top: 0px;
      right: -167px;
      font-size: 24px;
    }
    .btn-area {
      position: absolute;
      top: 72px;
      right: -125px;
      height: 100px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      button {
        width: 100px;
        margin-left: 0 !important;
      }
    }
  }
}
</style>
