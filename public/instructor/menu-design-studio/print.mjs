export function printSettings({page='A4 portrait',margin=15,density='standard',ink='color',categoryBreak=false}={}){
 const sizes={'A4 portrait':[210,297],'A4 landscape':[297,210],'A5 portrait':[148,210],'A5 landscape':[210,148]};
 if(!Object.hasOwn(sizes,page)||![10,15,20].includes(margin)||!['standard','compact','spacious'].includes(density)||!['color','economy'].includes(ink)||typeof categoryBreak!=='boolean')throw Error('invalid_print_settings');
 const [width,height]=sizes[page];
 return {page,margin,density,ink,categoryBreak,width,height,contentWidth:width-2*margin,contentHeight:height-2*margin};
}
export function pageCSS(settings){const p=printSettings(settings);return '@page{size:'+p.page+';margin:'+p.margin+'mm}'}
