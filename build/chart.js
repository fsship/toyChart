(function() {
    'use strict';

    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function Chart(element) {
        this.canvasElement = document.createElement('canvas');
        document.querySelector(element).appendChild(this.canvasElement);
        element = document.querySelector(element);
        this.width = element.scrollWidth;
        this.height = element.scrollHeight;
        this.canvasElement.setAttribute('width', element.scrollWidth + 'px');
        this.canvasElement.setAttribute('height', element.scrollHeight + 'px');
        this.ctx = this.canvasElement.getContext('2d');
        this.axisX = {};
        this.axisY = {};
        this.axisY.maxVal = 0;
        this.axisX.splitCount = 0;
    }

    Chart.prototype.__setAxis = function(data) {
        this.ctx.fillRect(0, this.height - 40, this.width, 5);
        this.ctx.fillRect(10, 10, 5, this.height);
        var maxData = 0;
        for (var i = 0; i < data.length; i++) {
            if (data[i].value > maxData) {
                maxData = data[i].value;
            }
        }
        this.axisY.maxVal = maxData;
        this.axisY.maxValPosition = 15;
        this.axisY.zeroValPosition = this.height - 40;
        this.axisX.splitCount = data.length;
        this.perAreaWidth = (this.width - 13) / this.axisX.splitCount;
        for (i = 0; i < this.axisX.splitCount; i++) {
            this.ctx.fillText(data[i].text, 18 + i * this.perAreaWidth, this.height - 20, this.perAreaWidth);
        }
    };

    Chart.prototype.__caculateStartPoint = function(value) {
        var topPercent = 1 - (value / this.axisY.maxVal);
        var allHeight = this.axisY.zeroValPosition - this.axisY.maxValPosition;
        return this.axisY.maxValPosition + allHeight * topPercent;
    };

    Chart.prototype.__drawBar = function(data) {
        this.__setAxis(data);
        console.log(this.axisX.splitCount);
        for (var i = 0; i < this.axisX.splitCount; i++) {
            var startPoint = this.__caculateStartPoint(data[i].value);
            console.log(startPoint);
            this.ctx.fillStyle = getRandomColor();
            this.ctx.fillRect(18 + i * this.perAreaWidth, startPoint, this.perAreaWidth, this.axisY.zeroValPosition - startPoint);
        }
    };

    Chart.prototype.draw = function(option) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = '#000000';
        switch (option.type) {
            case 'bar': this.__drawBar(option.data);
        }
    };

    window.Chart = Chart;
})();