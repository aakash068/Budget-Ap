const budgetController = (function()
    {
        const expense = function(id, description, value){
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
        };

        expense.prototype.calcPercent = function(income){
            if(income > 0 )
                this.percentage = Math.round((this.value / income) * 100);
            else
                this.percentage = -1;
        }

        expense.prototype.returnPercentage = function(){
            return this.percentage;
        }

        const income = function(id, description, value){
            this.id = id;
            this.description = description;
            this.value = value;
        };
        
        const calculateSum = function(type){
            var sum = 0;
            score.transferArr[type].forEach(function(currentElement) {
                sum = sum + currentElement.value;
            });
            score.finalScore[type] = sum;
        };

        var score = {
            transferArr:{
                inc: [],
                exp: []
            },
            finalScore:{
                inc: 0,
                exp: 0
            },
            budget: 0,
            percentage: -1
        };

        return {

            calculatePercentage:function(){
                score.transferArr.exp.forEach(function(expenseItem){
                    expenseItem.calcPercent(score.finalScore.inc); 
                });
            },

            getPercentage:function(){
                let percentArr = score.transferArr.exp.map(function(current){
                    return current.returnPercentage();
                });
                return percentArr;
            },

            enterInputValuestoBudget:function(type, desc, val){
                let id, newItem;
                if(score.transferArr[type].length === 0)
                    id = 0;
                else
                    id = score.transferArr[type][score.transferArr[type].length-1].id + 1;
                if(type === 'exp')
                    newItem = new expense(id, desc, val);
                else
                    newItem = new income(id, desc, val);
                score.transferArr[type].push(newItem);   
                return newItem;
            },

            deleteBudgetFields:function(obj){
                let id, index;
                id = score.transferArr[obj.type].map(function(current){
                    return current.id;
                });
                index = id.indexOf(obj.id);
                score.transferArr[obj.type].splice(index, 1);
            },

             calculateBudgetData:function(){
                calculateSum('inc');
                calculateSum('exp');
                score.budget = score.finalScore.inc - score.finalScore.exp; 
                if(score.finalScore.inc !== 0 )
                    score.percentage = Math.round((score.finalScore.exp / score.finalScore.inc) * 100);
                else
                    score.percentage = -1;
            },

            accessBudgetData:function(){   
                return {
                    totalBudget: score.budget,
                    totalIncome: score.finalScore.inc,
                    totalExpense: score.finalScore.exp,
                    percentage: score.percentage
                };
            },
        };
    })();

const UIController = (function(){
    
    DOMclasses = {
              button:'.add__btn', 
                type:'.add__type',
     fieldsContainer:'.container',
                 val:'.add__value',
         incomeField:'.income__list',
         finalBudget:'.budget__value',
        expenseField:'.expenses__list',
      expensePercent:'.item__percentage',
                desc:'.add__description',
        deleteButton:'.item__delete--btn',
               month:'.budget__title--month',
         finalIncome:'.budget__income--value',
        finalExpense:'.budget__expenses--value',
          percentage:'.budget__expenses--percentage'
    }
    
    const formatNumber = function(num, type){
        let numArr, int, decimal;
        num = Math.abs(num);
        num = num.toFixed(2);
        numArr = num.split('.');
        int = '' + numArr[0];
        if(int.length > 6)
            {int = int.substr(0, int.length-6) + ',' + int.substr(int.length-6, int.length-3) + ',' + int.substr(int.length - 3, int.length);}
        else if(int.length > 3) 
            {int = int.substr(0, int.length-3) + ',' + int.substr(int.length-3, int.length);}
        decimal = numArr[1];
        return ((type === 'exp')? '- ':'+ ') + int + '.' + decimal;
    };

    return{

        updatePercentage:function(percentage){
            let expenseList;
            expenseList = document.querySelectorAll(DOMclasses.expensePercent); 

            //Function Defination
            var x = function(List, callback){
                for(let  i = 0; i < List.length; i++)
                {
                    callback(List[i], i);
                }
            };
            
            //Calling the function by passing the nodelist and a anonymous function as parameter
            x(expenseList, function(current,index){
                if(percentage[index] > 0 )
                    current.textContent = percentage[index] + '%';
                else
                    current.textContent = '--';
            });
        },

        userValue:function(){
            return{
                type: document.querySelector(DOMclasses.type).value,
                description: document.querySelector(DOMclasses.desc).value,
                value: parseFloat(document.querySelector(DOMclasses.val).value)
            };
        },

        clearInput:function(){
            let fieldList, fieldsArray;
            fieldList = document.querySelectorAll(DOMclasses.desc + ',' + DOMclasses.val);
            fieldsArray = Array.prototype.slice.call(fieldList);
            fieldsArray.forEach(function(currentElement) {
                currentElement.value = '';});
            fieldsArray[0].focus();
        },

        updateFinalBudget:function(obj){

            document.querySelector(DOMclasses.finalIncome).textContent = formatNumber(obj.totalIncome, 'inc');
            document.querySelector(DOMclasses.finalExpense).textContent = formatNumber(obj.totalExpense, 'exp');
            document.querySelector(DOMclasses.finalBudget).textContent = formatNumber(obj.totalBudget, (obj.totalBudget > 0)? 'inc':'exp');
            if(obj.percentage > 0)
                document.querySelector(DOMclasses.percentage).textContent = obj.percentage + '%';
            else
                document.querySelector(DOMclasses.percentage).textContent = '--';
        },

        getDOMaccess:function(){
            return DOMclasses;
        },

        pushInputValuestoUI:function(obj, type){
            let html, newHtml, elementType;
            if(type === 'inc')
            {
                elementType = DOMclasses.incomeField;
                html = '<div class="item clearfix" id="inc-(id)"><div class="item__description">(desc)</div><div class="right clearfix"><div class="item__value">(val)</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else
            {
                elementType = DOMclasses.expenseField;
                html = '<div class="item clearfix" id="exp-(id)"><div class="item__description">(desc)</div><div class="right clearfix"><div class="item__value">(val)</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            newHtml = html.replace('(id)', obj.id);
            newHtml = newHtml.replace('(desc)', obj.description);
            newHtml = newHtml.replace('(val)', formatNumber(obj.value, type));
            document.querySelector(elementType).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteFields:function(id){
            var child = document.getElementById(id); 
            child.parentNode.removeChild(child);
        },

        updateTime:function(){
            let now = new Date();
            let monthArr = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
            document.querySelector(DOMclasses.month).textContent = monthArr[now.getMonth()] + " " + now.getFullYear();
        }
    };
})();
    
const appController = (function(Bctrl, Uctrl){
    
    const updatePercentage = function(){
        //Calculate the percentage for every element iun expense array
        Bctrl.calculatePercentage();

        //get the percentage data structure
        let percentage = Bctrl.getPercentage();

        //Update the percentage data into UI
        Uctrl.updatePercentage(percentage);
    };

    var addItem = function(){
        let userInput = Uctrl.userValue();
        if(userInput.description !== "" && !isNaN(userInput.value) && userInput.value > 0)
        {
            Uctrl.clearInput();
            let newItem = Bctrl.enterInputValuestoBudget(userInput.type, userInput.description, userInput.value);
            Uctrl.pushInputValuestoUI(newItem, userInput.type);
            
            //Update the budget data.
            updateBudget();

            //Update Prcentage
            updatePercentage();
        }
    };

    var updateBudget = function(){
        Bctrl.calculateBudgetData();
        let budgetData = Bctrl.accessBudgetData();
        Uctrl.updateFinalBudget(budgetData);
    };

    var eventListeners = function(){
        let DOM = Uctrl.getDOMaccess();
        document.querySelector(DOM.button).addEventListener('click', addItem);
        document.querySelector(DOM.button).addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13)
                addItem();
        });
        document.querySelector(DOM.fieldsContainer).addEventListener('click', deleteFields);   
    };

    var deleteFields = function(event){
        var item, itemArr, type, id, updatedBudget;
        item = event.target.parentNode.parentNode.parentNode.parentNode.id;
        itemArr = item.split('-');
        field={
            id: parseInt(itemArr[1]),
            type: itemArr[0]
        };

        //Delete the budget fields from the data structure
        Bctrl.deleteBudgetFields(field);
        
        //Calculate the budget
        updateBudget();

        //Return the updated Budget values
        updatedBudget = Bctrl.accessBudgetData();

        //Update the budget data in UI
        Uctrl.updateFinalBudget(updatedBudget);

        //Delete the UI fields from the UI
        Uctrl.deleteFields(item);

        //Update Prcentage
        updatePercentage();
    };

    return{
        initial:function(){
            Uctrl.updateTime();
            updateBudget();
            eventListeners();
        }
    };
    
})(budgetController, UIController);


appController.initial();