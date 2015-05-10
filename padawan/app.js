(function(){
    function PadawanClient($http){
        this.getCompletion = function(content, line, column){
            content = content || "";
            if(column < 0) {
                column = 0;
            }
            ++column;
            var query = 'filepath='+encodeURIComponent('/test.php')+
                '&path=' + encodeURIComponent('/some/bad/path')+
                '&line='+encodeURIComponent(line) + '&column=' + column;
            var data = encodeURIComponent(content);
            return $http.post('http://padawan-php.herokuapp.com/complete?'+query, data)
            .then(function(response){
                return response.data.completion;
            });
        };
    }
    function MenuEntries(){
        var entries = [];
        var selectedEntry = 0;
        this.block = null;
        this.setPosition = function(line, column){
            var top = line * 22.6;
            var left = column * 10.6;
            this.block.style.top = top + 'px';
            this.block.style.left = left + 'px';
        };
        this.selectNext = function(){
            if(selectedEntry === 0){
                entries[entries.length - 1].isSelected = false;
            }
            else {
                entries[selectedEntry - 1].isSelected = false;
            }
            entries[selectedEntry].isSelected = true;
            ++selectedEntry;
            if(selectedEntry >= entries.length){
                selectedEntry %= entries.length;
            }
        };
        this.getSelectedEntry = function(){
            return entries[selectedEntry];
        };
        this.init = function(){
            this.block = document.getElementById('completion');
        };
        this.list = function(){
            return entries;
        };
        this.clear = function(){
            entries = [];
        };
        this.set = function(list){
            entries = list;
            selectedEntry = 0;
            if(this.isActive()){
                this.selectNext();
            }
        };
        this.isActive = function(){
            return entries && entries.length > 0;
        };
    }
    function EditorCtrl($scope, PadawanClient, MenuEntries, editorDefault){
        var editor = this;
        this.buffer = editorDefault;
        this.menu = MenuEntries;
        var lowLeverBuffer = document.getElementById('buffer');
        this.menu.init();
        this.getEntries = function(){
            var partialValue = lowLeverBuffer.value.substr(0, lowLeverBuffer.selectionStart);
            var columnNumber = lowLeverBuffer.selectionStart - partialValue.lastIndexOf('\n') - 1;
            var lineNumber = partialValue.split('\n').length;
            PadawanClient
                .getCompletion(editor.buffer || "", lineNumber, columnNumber)
                .then(function(entries){
                    editor.menu.set(entries);
                });
            this.menu.setPosition(lineNumber, columnNumber);
        };
        this.addText = function(text){
            this.menu.clear();
            this.buffer = lowLeverBuffer.value.substr(0, lowLeverBuffer.selectionStart) +
                text + lowLeverBuffer.value.substr(lowLeverBuffer.selectionStart);
        }
        this.addEntry = function(entry){
            this.addText(entry.name);
        };
        this.handleKey = function($e){
            if(this.menu.isActive()){
                if($e.keyCode === 13){
                    this.addEntry(this.menu.getSelectedEntry());
                    $e.preventDefault();
                }
                else if($e.keyCode === 9){
                    this.menu.selectNext();
                    $e.preventDefault();
                }
            }
            else {
                if($e.keyCode === 9){
                    $e.preventDefault();
                    this.addText('\t');
                }
                else {
                    this.menu.clear();
                }
            }
        };
    }

    angular
        .module('editorApp', [
        ])
        .constant('editorDefault', '<?php\n\nclass Test{\n\n\t/** @return Test */\n\tpublic function test(){\n\t}\n}\n\n$var = new Test;\n$var-')
        .service('PadawanClient', PadawanClient)
        .service('MenuEntries', MenuEntries)
        .controller('EditorCtrl', EditorCtrl);
}());
