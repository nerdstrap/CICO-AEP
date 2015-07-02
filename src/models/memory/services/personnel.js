define(function(require) {

    "use strict";

    var internalPersonnel = [{"aepId":"SsKuzH7wd9MKS/XxmvndFA==","userName":"Aguilar,, Gasper (Bubba) ","contact":"9,1,3612221039"},{"aepId":"MbCoGUU7uAMy/gL/1wdeDg==","userName":"BAK, LAWRENCE  "},{"aepId":"h+BLgae1GUzH5hY0z3oIfA==","userName":"BARNT,  RYAN ","contact":"9-1-614-205-0511"},{"aepId":"KtDu0YQEylZz9/MLLcZg4g==","userName":"Badgley,, Aaron J. ","contact":"9,1,4055956134"},{"aepId":"Vj8N/d9jf8VnR9i1bHew8A==","userName":"Badgley,, Robert ","contact":"9,1,4059058701"},{"aepId":"KEd3f+izYf9OrgDFfDKHSw==","userName":"Badillo,, Gustavo ","contact":"9,1,3612903186"},{"aepId":"T0h0qmHNkEWNt2qhR1QCiw==","userName":"Baeza,, Manuel V. ","contact":"9,1,4323863234"},{"aepId":"gWj2YNE8mV5ZYgzr2qFXvg==","userName":"Bailey, Keith  ","contact":"325-668-6391"},{"aepId":"DW/eoqXbkfGhc0BuD3r4XA==","userName":"Bain,, David ","contact":"9,1,7155517258"},{"aepId":"lxQdSk2W4Mn2KfG8dCE3Lg==","userName":"Baker,, Mark A. ","contact":"9,1,3256572860"},{"aepId":"OuqX70JFwzjcj/zXmreJAQ==","userName":"Balderas,, Jose M. ","contact":"9,1,8302610382"},{"aepId":"+Ag2hn9zoYxPYG6XOFbvPA==","userName":"Bale, Richard E","contact":"614/226-2906"},{"aepId":"C+yifLV2gH9d5yxkBl2K/g==","userName":"Ballard,, Mickey R. ","contact":"9,1,5737126463"},{"aepId":"NKxyAi6WAl8+3OAVvzR6lg==","userName":"Balli,, Juan M. ","contact":"9,1,9564331360"},{"aepId":"Gg3iq96j2nfkqgunJDNTgQ==","userName":"Baltic, Michael E","contact":"1234567890"},{"aepId":"Gg3iq96j2nfkqgunJDNTgQ==","userName":"Baltic, Michael E","contact":"1234567890"},{"aepId":"Gg3iq96j2nfkqgunJDNTgQ==","userName":"Baltic, Michael E","contact":"1234567890"},{"aepId":"UkWFNrPTlNlj+/7TIOfuIw==","userName":"Baltierra, Luis  ","contact":"361-658-6625"},{"aepId":"cNm2xAkQnf1F7AfO16NkLg==","userName":"Barbosa,, Manuel ","contact":"9,1,9564544399"},{"aepId":"wyTTzs9T8hmf+/RpE39l8g==","userName":"Barker,, Grant ","contact":"9,1,4233223704"},{"aepId":"IL+UB4BoR1dUQDEq7IFxig==","userName":"Barker,, Kenneth Grant ","contact":"9,1,4239918150"},{"aepId":"RRziNHCpQ+2jncbztTTWSw==","userName":"Barley,, Tony L. ","contact":"9,1,9405858261"},{"aepId":"9Us0C5Ke//OT2bD9FLbDDA==","userName":"Barnard,, Kevin ","contact":"9,1,3612305187"},{"aepId":"UGjFgiezJsWyS82xfAtmZQ==","userName":"Barnes,, Todd James ","contact":"9,1,9189231183"},{"aepId":"i0889h+CsnZvis5puMW08w==","userName":"Barnett,, Rick ","contact":"9,1,8304565740"},{"aepId":"+lhGEFjSwaBitkqn+tEeBA==","userName":"Barr,, David G. ","contact":"9,1,3256656637"},{"aepId":"w5TAbt8xzYAvKOQJBBDluQ==","userName":"Barrera,, Arthur ","contact":"9,1,2147251627"},{"aepId":"GBqoIbuDOSHkd9vhsRKN4w==","userName":"Barrera,, Donny E. ","contact":"9,1,3256658857"},{"aepId":"CtUxxsKsdg98ynloNIqXtw==","userName":"Barrientez,, David ","contact":"9,1,2102696513"},{"aepId":"znnMcDfuR4ml37DqtKI6UA==","userName":"Barrow,, Lex ","contact":"9,1,3254465113"},{"aepId":"kk/4CzNXRnx6hxLiSAHINA==","userName":"Barrow,, Sherman D. ","contact":"9,1,8307763949"},{"aepId":"SdZ8xointcWLhfUw3UF2TQ==","userName":"Bartels, Larry ","contact":"9-1-269-208-9301"},{"aepId":"pVm6b+meiHabmC7H+han5g==","userName":"Barton, Gary ","contact":"9-1-260-409-5832"},{"aepId":"QJbJCgIE6JEcexV+tHxaUg==","userName":"Barton,, Mike ","contact":"9,1,3618941111"},{"aepId":"Mc+5K2LqwmTbbM1460sbpg==","userName":"Bartts,, Larry ","contact":"9,1,3256691579"},{"aepId":"CxBWg+PP+Lcsxa54oFm8DQ==","userName":"Bauer,, John A. ","contact":"9,1,9564633235"},{"aepId":"sPkXVD8NxkI9kCf+/ghgcg==","userName":"Baughtman,, James ","contact":"9,1,4322961995"},{"aepId":"8A9acQ/MhCQfNCAfYA0iIg==","userName":"Bazan,, Elroy ","contact":"9,1,9567356731"},{"aepId":"1UPnQrrcBFaSLaIme+tV6A==","userName":"Bazan,, Gilberto (Sr.) ","contact":"9,1,8305701738"},{"aepId":"ZrJ5daxugGW3mslY0iQLPA==","userName":"Caballero,, Alfredo ","contact":"9,1,9565622979"},{"aepId":"qMNWfspigCMKN4K3ngeSYg==","userName":"Caballero,, Ruben ","contact":"9,1,9567935434"},{"aepId":"SUVh5ZQlrgFFQCh9m59Ihg==","userName":"Caballero,, Rueben J. ","contact":"9,1,9565229198"},{"aepId":"EAl5I+pcm+fQ9A3qD6Mr9Q==","userName":"Carrion,, Baudelio Pete ","contact":"9,1,9563300150"},{"aepId":"25MKLUv5UfZgSv9hv56FjQ==","userName":"Ceballos,, Raul ","contact":"9,1,3612903186"},{"aepId":"d0h6DHiK0VgKQNAUIE7eLA==","userName":"Epps,, Rosalba A. ","contact":"9,1,9563578049"},{"aepId":"Sa6k7QM7pXR/VmyDVshpsg==","userName":"Escobar,, Isaac ","contact":"9,1,9564376780"},{"aepId":"OyBR8qpBoGuzRnFsciE+cw==","userName":"Esquivel,, Baldemar ","contact":"9,1,8302611690"},{"aepId":"BkdEJpbcO8ukzyRNjS14BQ==","userName":"Ibarra,, Gustavo ","contact":"9,1,9562317736"},{"aepId":"RgL7j5t+TU1GDqpIJQX19w==","userName":"KILBANE, DAVE ","contact":"9-1-540-525-6276"},{"aepId":"HLgF5gHrynkyu3/rQo2ZlQ==","userName":"KUBALA, LOUIS "},{"aepId":"p//nu665tn+nS9tbkQCQsw==","userName":"Kubala,, Mark A. ","contact":"9,1,9793204793"},{"aepId":"XmClk4TMnbOZtfsUbF3G5g==","userName":"LABAY(TESTRONICS), JUSTIN (979-665-6202) "},{"aepId":"anzU7q9eq38k0PG+lZ6VCg==","userName":"Moczygemba,, Jason ","contact":"9,1,8302998103"},{"aepId":"O+0RaW6otbhrdJSUKNJpyw==","userName":"Moncibais,, Manuel ","contact":"9,1,3256572726"},{"aepId":"n8uzH4URGeAS0exJy2UOlg==","userName":"Morin,, Basil E. ","contact":"9,1,9564570327"},{"aepId":"y3O3gpv3m0frnnCVBuuEmw==","userName":"Railsback,, Larry G. ","contact":"9,1,9406558457"},{"aepId":"R597o1pI8VumJ6que9Ua3Q==","userName":"Rosenbaum,, Joe ","contact":"9,1,9565351268"},{"aepId":"dW3PlyaYiFTT555W/m51fw==","userName":"Rosenbaum,, Sotero (Junior) ","contact":"9,1,9566266011"},{"aepId":"TkUeZIt5CFrGI7qcebIOJA==","userName":"Ybarra,, Christopher T. ","contact":"9,1,3613432803"},{"aepId":"9muRv4U5iDGiDlt01NhMNg==","userName":"Ybarra,, Gustavo (Gus) ","contact":"9,1,9562299899"},{"aepId":"91XETgp5fhC9EeG1uNIPbg==","userName":"Ybarra,, Pedro ","contact":"9,1,8302671681"},{"aepId":"hZjValdPdGMfK2/oENIFgw==","userName":"Ybarra,, Ramon R. ","contact":"9,1,8302795339"},{"aepId":"RAMizZztl7CflTIQ71MioQ==","userName":"bart thompson,  "},{"aepId":"NNb0uR/0O+SDr6yB9dIPFg==","userName":"ibarra , ismael 956-463-9966 "}],
    internalFindById = function(id) {
        var deferred = $.Deferred(),
                result = null,
                l = internalPersonnel.length,
                i;

        for (i = 0; i < l; i = i + 1) {
            if (internalPersonnel[i].aepId === id) {
                result = internalPersonnel[i];
                break;
            }
        }
        deferred.resolve(result);
        return deferred.promise();
    },
    internalFindByName = function(searchKey) {
        var deferred = $.Deferred(),
                results = internalPersonnel.filter(function(element) {
            return element.userName.toLowerCase().indexOf(searchKey || "".toLowerCase()) > -1;
        });
        deferred.resolve(results);
        return deferred.promise();
    },

    stations = {
        findById: function(id) {
            return internalFindById(id);
        },
        findByName: function (searchKey) {
            return internalFindByName(searchKey);
        }

    };

    return stations;

});