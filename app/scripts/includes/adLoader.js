/* global googletag */

var gads = document.createElement('script');
    gads.async = true;
    gads.type = 'text/javascript';
var useSSL = document.location.protocol === 'https:';
    gads.src = (useSSL ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
var node = document.getElementsByTagName('script')[0];
node.parentNode.insertBefore(gads, node);

googletag.cmd.push(function () {
  googletag.pubads().setTargeting('tribpedia', 'price-of-admission');

  // BANNER SIZING
  // var bannerMapping = googletag.sizeMapping()
  //   .addSize([0, 0], [300, 250])
  //   .addSize([768, 1], [728, 90])
  //   .build();

  // INSIDE STORY SIZING
  var insideMapping = googletag.sizeMapping()
    .addSize([0, 0], [300, 250])
    .addSize([510, 1], [468, 60])
    .build();

  // 300X250 SIZING
  var sidebarMapping = googletag.sizeMapping()
    .addSize([0, 0], [300, 250])
    .build();


   // ALWAYS COMMENT OUT OR DELETE ADS YOU'RE NOT USING.
   // CALLING ADS THAT AREN'T BEING DISPLAYED
   // MAY CAUSE ALL OF THE AD SLOTS TO NOT "FETCH" OR "RENDER"

  // googletag.defineSlot('/5805113/TexasTribune_Site_Roofline1_ATF_Leaderboard_728x90', [728, 90], 'ad-banner-1')
  //   .defineSizeMapping(bannerMapping)
  //   .addService(googletag.pubads());

  googletag.defineSlot('/5805113/TexasTribune_Content_StoryLanding_ATF_RightRail1_MediumRectangle_300x250', [300, 250], 'ad-sidebar-1')
    .defineSizeMapping(sidebarMapping)
    .addService(googletag.pubads());

  googletag.defineSlot('/5805113/TexasTribune_Content_StoryLanding_ATF_RightRail2_MediumRectangle_300x250', [300, 250], 'ad-sidebar-2')
    .defineSizeMapping(sidebarMapping)
    .addService(googletag.pubads());

  googletag.defineSlot('/5805113/TexasTribune_Content_StoryPage_InsideStory_468x60', [468, 60], 'ad-inside-1')
    .defineSizeMapping(insideMapping)
    .addService(googletag.pubads());

  // googletag.defineSlot('/5805113/TexasTribune_Content_StoryPage_InsideStory2_468x60', [468, 60], 'ad-inside-2')
  //   .defineSizeMapping(insideMapping)
  //   .addService(googletag.pubads());

  // googletag.defineSlot('/5805113/TexasTribune_Content_NewsApps_BTF_Footer_Leaderboard_728x90', [728, 90], 'ad-banner-footer')
  //   .defineSizeMapping(bannerMapping)
  //   .addService(googletag.pubads());

  googletag.pubads().enableSingleRequest();
  googletag.enableServices();
});

googletag.cmd.push(function () {
  // googletag.display('ad-banner-1');
  googletag.display('ad-sidebar-1');
  googletag.display('ad-sidebar-2');
  googletag.display('ad-inside-1');
  // googletag.display('ad-inside-2');
  // googletag.display('ad-banner-2');
});