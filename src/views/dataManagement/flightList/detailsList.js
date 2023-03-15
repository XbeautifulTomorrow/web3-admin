export default (listObj) => {
    const {
      id,
      flightId,
      coin,
      wallet,
      poolConfig,
      miningName,
      miningVersion,
      viceCoin,
      viceWallet,
      vicePoolConfigId,
      vicePoolName,
      vicePoolConfig,
      strength,
    } = listObj;
    const { coinName, coinImage } = coin;
    let { walletAddress, walletName } = wallet;
    const { sslUrls, poolServerIds, serverUrl } = poolConfig;
    if (viceWallet) {
      walletAddress += viceWallet.walletAddress;
      walletName += viceWallet.walletName;
    }
    const _data = {
      flightId,
      coinName,
      walletAddress,
      walletName,
      sslUrls: sslUrls === 'DISABLE' ? '关' : '开',
      poolServerIds,
      serverUrl,
      miningName,
      miningVersion,
      viceCoin,
      vicePoolConfigId,
      vicePoolName,
      vicePoolConfig,
      strength,
    };
    return _data;
  };
  