/**
 * Created by Bob on 17/10/19.
 */


(function ($) {
    $.fn.tableFixed = function(options) {
        var defaults = {
            height:'100%',
            columns:0
        };
        var settings = $.extend(defaults, options);
        return this.each(function(){
            var $this = $(this),
                $thead = $this.find('thead'),
                $tbody = $this.find('tbody'),
                $colgroup = $this.find('colgroup'),
                $headWrap  = $('<div class="knaq-t-head"></div>'),
                $bodyWrap  = $('<div class="knaq-t-body"></div>'),
                $parent = $this.parent();


            if(!($this.height() > settings.height)){
                settings.height = $this.height();
            }

            $parent.height(settings.height);

            // 创建thead div
            var eleColgroup = $colgroup[0].cloneNode(true),
                $headTable  = $('<table>').append( $(eleColgroup) ).append( $thead );
            $headWrap.append( $headTable ).appendTo( $parent );

            // 设置tbody高度
            var tbodyHeight = settings.height - parseInt( $headWrap.height() );
            console.log($headWrap.height());
            // 创建tbody div
            $bodyWrap.append($this).height( tbodyHeight ).appendTo( $parent );

            // 如果有竖向滚动条
            if($bodyWrap[0].offsetWidth !== $bodyWrap[0].clientWidth){
                $thead.find('tr').each(function(){
                    var $this = $(this);
                    $this[0].innerHTML += '<th class="gutter" width="'+ ($bodyWrap[0].offsetWidth - $bodyWrap[0].clientWidth) +'"></th>';
                });
            }

            // 设置固定列滚动队列 jquery对象数组
            var tbodyArr = [];

            // 判断列固定参数
            if(!!settings.columns && JSON.stringify(settings.columns) !== '{}' && $this.width() > $parent.width()){
                for (var x in settings.columns){
                    switch (x){
                        case 'left':
                        case 'right':
                            var column = columns(x,settings.columns[x]);
                            tbodyArr.push(column.find('.knaq-t-body'));
                            break;
                        default:
                            console.log('columns参数属性有误');
                            break;
                    }
                }
            }

            // 创建固定列
            function columns(type,n){
                var $columnsBox = $('<div class="knaq-t-columns"></div>');
                    if(type === 'left'){
                        $columnsBox.css({
                            'left':0
                        })
                    }else{
                        $columnsBox.css({
                            'right':0
                        })
                    }

                var cols = $tbody.find('tr').eq(0).find('td'),
                    columnsWidth = 0,
                    borderWidth  = parseInt($parent.css('border-left-width'));

                for(var i = 0;i < n; i++){
                    columnsWidth += cols.eq(i).outerWidth(true);
                }
                var $thisInnerHTML = $parent.html();

                $columnsBox.html($thisInnerHTML).width(columnsWidth + borderWidth);

                // $columnsBox.find('table').width($parent.width());


                // 如果有横向滚动条
                if($bodyWrap[0].offsetHeight !== $bodyWrap[0].clientHeight){
                    var scrollBarWidth = $bodyWrap[0].offsetHeight - $bodyWrap[0].clientHeight;
                    $columnsBox.css({
                        'bottom': scrollBarWidth
                    });
                    var $columnsBody = $columnsBox.find('.knaq-t-body');
                    $columnsBody.css({
                        height: $columnsBody.height() - scrollBarWidth
                    });
                };

                $columnsBox.appendTo($parent);
                // 删除copy的table的id
                if(!!$this[0].id){
                    $columnsBox.find('#' + $this[0].id)[0].removeAttribute('id');
                }
                return $columnsBox;
            }

            // 处理滚动事件
            var startX = $bodyWrap.scrollLeft(),startY = $bodyWrap.scrollTop();
                $bodyWrap.on('scroll',function(event){
                    if(startX !== $bodyWrap.scrollLeft()){
                        startX = $bodyWrap.scrollLeft();
                        // 设置表头一起X轴滚动
                        $headWrap.scrollLeft(startX);
                    }else if(startY !== $bodyWrap.scrollTop()){
                        startY = $bodyWrap.scrollTop();
                        // 设置固定列一起Y轴滚动
                        tbodyArr.forEach(function(obj){
                            obj.scrollTop(startY);
                        })
                    }else{
                        return false;
                    }
                });
        });
    };
})(jQuery)