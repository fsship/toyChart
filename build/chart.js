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
            this.ctx.fillText(data[i].text, this.perAreaWidth / 2 + i * this.perAreaWidth, this.height - 20, this.perAreaWidth);
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

    Chart.prototype.__drawLine = function(data) {
        this.__setAxis(data);
        this.ctx.fillStyle = getRandomColor();
        this.ctx.beginPath();
        for (var i = 0; i < this.axisX.splitCount; i++) {
            var startPoint = this.__caculateStartPoint(data[i].value);
            if (i === 0) {
                this.ctx.moveTo(this.perAreaWidth / 2 + i * this.perAreaWidth, startPoint);
            } else {
                this.ctx.lineTo(this.perAreaWidth / 2 + i * this.perAreaWidth, startPoint);
            }
        }
        this.ctx.stroke();
        this.ctx.closePath();
    };

    Chart.prototype.__drawPie = function(data) {
        this.ctx.translate(this.width / 2, this.height / 2);
        var radius = this.height * 0.4;
        var total = data.map(function(item) {
            return item.value;
        }).reduce(function(prev, current) {
            return prev + current;
        });
        console.log(total);
        var lastAngel = - Math.PI * 0.5;
        for (var i = 0; i < data.length; i++) {
            this.ctx.fillStyle = getRandomColor();
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            var currentAngel = lastAngel + 2 * Math.PI * data[i].value / total;
            var middleAngel = (currentAngel + lastAngel) / 2;
            this.ctx.arc(0, 0, radius, lastAngel, currentAngel);
            lastAngel = currentAngel;
            console.log(currentAngel);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.fillText(data[i].text, (radius + 10) * Math.cos(middleAngel), (radius + 10) * Math.sin(middleAngel));
        }
    };

    Chart.prototype.draw = function(option) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = '#000000';
        switch (option.type) {
            case 'bar': this.__drawBar(option.data); break;
            case 'line': this.__drawLine(option.data); break;
            case 'pie': this.__drawPie(option.data); break;
            default: throw new Error('No such chart type: ' + option.type);
        }
    };

    window.Chart = Chart;
})();