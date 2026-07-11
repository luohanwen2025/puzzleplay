const C3 = globalThis.C3;

C3.Plugins.Azerion_Integration_SDK.Acts =
{
	InitializeSDK()
	{
		this._initializeSDK();
	},
	OnLoadStart()
	{
		this._onLoadStart();
	},
	OnLoadProgress(progress)
	{
		this._onLoadProgress(progress);
	},
	OnLoadComplete()
	{
		this._onLoadComplete();
	},
	AddListeners()
	{
		this._addListeners();
	},
	OnAdProviderLoaded()
	{
		this._onAdProviderLoaded();
	},
	OnGameStart(level)
	{
		this._onGameStart(level);
	},
	OnGameEnd(completed, level, score)
	{
		this._onGameEnd(completed, level, score);
	},
	ShowInterstitialAd(ytPlacementId, h5PlacementId)
	{
		this._showInterstitialAd(ytPlacementId, h5PlacementId);
	},
	ShowRewardedAd(ytPlacementId, h5PlacementId)
	{
		this._showRewardedAd(ytPlacementId, h5PlacementId);
	},
	PreloadAd(type)
	{
		this._preloadAd(type);
	},
	SendScoreEvent(score, level, cumulativeScore, gameTitle, platformId) 
	{
		this._sendScoreEvent(score, level, cumulativeScore, gameTitle, platformId);
	},
	PauseAdTimer()
	{
		this._pauseAdTimer();
	},
	ResumeAdTimer()
	{
		this._resumeAdTimer();
	},
	LoadData()
	{
		this._loadData();
	},
	SaveData(data)
	{
		this._saveData(data);
	},
	OnSplashRemoved()
	{
		this._onSplashRemoved();
	}
};
