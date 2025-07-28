import React, { useState } from 'react';
export default (props: any) => {
  const [input1, onChangeInput1] = useState('');
  const [input2, onChangeInput2] = useState('');
  const [input3, onChangeInput3] = useState('');
  const [input4, onChangeInput4] = useState('');
  const [input5, onChangeInput5] = useState('');
  const [input6, onChangeInput6] = useState('');
  const [input7, onChangeInput7] = useState('');
  const [input8, onChangeInput8] = useState('');
  return (
    <div className="flex flex-col bg-white">
      <div className="flex h-[1215px] flex-col items-start self-stretch bg-[#E9EEFA]">
        <div
          className="mb-10 flex items-center justify-between self-stretch bg-white px-[30px] py-4"
          style={{
            boxShadow: '0px 8px 16px #2019AB0D',
          }}
        >
          <img
            src={
              'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/c46iuwrd_expires_30_days.png'
            }
            className="h-10 w-40 object-fill"
          />
          <div className="flex shrink-0 items-start">
            <div className="mr-[632px] flex shrink-0 items-center gap-3">
              <img
                src={
                  'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/3v8unfqs_expires_30_days.png'
                }
                className="h-8 w-8 object-fill"
              />
              <div className="flex shrink-0 items-center gap-10">
                <div className="flex shrink-0 items-start gap-2 pr-0.5">
                  <div className="flex shrink-0 items-center gap-[7px]">
                    <span className="text-sm font-bold text-[#23252A]">
                      {'경영관리실'}
                    </span>
                    <img
                      src={
                        'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/0900ohz7_expires_30_days.png'
                      }
                      className="h-4 w-4 object-fill"
                    />
                  </div>
                  <span className="text-sm font-bold text-[#23252A]">
                    {'김운용'}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-2.5">
                  <div className="flex shrink-0 items-center gap-1.5 pr-0.5">
                    <img
                      src={
                        'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/ob8n9wou_expires_30_days.png'
                      }
                      className="h-6 w-6 object-fill"
                    />
                    <span className="text-sm font-bold text-[#2E73E3]">
                      {'28:57'}
                    </span>
                  </div>
                  <button
                    className="flex shrink-0 flex-col items-start rounded-[20px] border-0 bg-[#F2F7FF] px-4 py-[5px] text-left"
                    onClick={() => alert('Pressed!')}
                  >
                    <span className="text-[13px] font-bold text-[#2E73E3]">
                      {'연장'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-6">
              <img
                src={
                  'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/ffxb344v_expires_30_days.png'
                }
                className="h-8 w-8 object-fill"
              />
              <img
                src={
                  'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/odbaflhp_expires_30_days.png'
                }
                className="h-8 w-8 object-fill"
              />
              <div className="flex shrink-0 flex-col items-start bg-[url('https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/jz1we093_expires_30_days.png')] bg-cover bg-center pr-[1px] pb-4 pl-3.5">
                <div className="flex flex-col items-start rounded-[500px] border border-solid border-white bg-[#EC2C6C] px-[3px] py-[1px]">
                  <span className="text-[10px] font-bold text-white">
                    {'99'}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1 pr-0.5">
                <img
                  src={
                    'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/p1z6ju5n_expires_30_days.png'
                  }
                  className="h-6 w-6 object-fill"
                />
                <span className="text-sm font-bold text-[#23252A]">
                  {'로그아웃'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-10 mb-2.5 flex items-center gap-10 self-stretch">
          <div
            className="flex shrink-0 flex-col items-end rounded-xl bg-[#2E73E3] pt-2.5 pb-6"
            style={{
              boxShadow: '0px 8px 16px #2019AB0D',
            }}
          >
            <div className="mb-1 flex flex-col items-start">
              <div className="flex items-start rounded-[10px] px-6 py-3">
                <div className="mr-[85px] flex shrink-0 items-center gap-2 pr-0.5">
                  <img
                    src={
                      'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/7ageamtj_expires_30_days.png'
                    }
                    className="h-5 w-5 object-fill"
                  />
                  <span className="text-base font-bold text-white">
                    {'CEO소통방'}
                  </span>
                </div>
                <img
                  src={
                    'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/j8xo3n84_expires_30_days.png'
                  }
                  className="h-6 w-6 rounded-[10px] object-fill"
                />
              </div>
              <div className="flex flex-col items-start">
                <div className="mx-6 flex items-center gap-1.5 rounded-xl py-[13px] pr-[142px]">
                  <img
                    src={
                      'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/1gf7rywl_expires_30_days.png'
                    }
                    className="h-[18px] w-3.5 object-fill"
                  />
                  <span className="text-[15px] font-bold text-white">
                    {'의견작성'}
                  </span>
                </div>
                <div className="mx-6 flex items-center gap-1.5 rounded-xl py-[13px] pr-[143px]">
                  <img
                    src={
                      'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/e6xxi36n_expires_30_days.png'
                    }
                    className="h-[18px] w-3.5 object-fill"
                  />
                  <span className="text-[15px] font-bold text-white">
                    {'미팅신청'}
                  </span>
                </div>
                <div className="mx-6 flex items-center gap-1.5 rounded-xl py-[13px] pr-[143px]">
                  <img
                    src={
                      'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/7ksdz00d_expires_30_days.png'
                    }
                    className="h-[18px] w-3.5 object-fill"
                  />
                  <span className="text-[15px] font-bold text-white">
                    {'일정공지'}
                  </span>
                </div>
                <div className="mx-6 flex items-center gap-1.5 rounded-xl py-[13px] pr-[143px]">
                  <img
                    src={
                      'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/16vtmdic_expires_30_days.png'
                    }
                    className="h-[18px] w-3.5 object-fill"
                  />
                  <span className="text-[15px] font-bold text-white">
                    {'투표하기'}
                  </span>
                </div>
                <div className="mx-6 flex items-center gap-1.5 rounded-xl py-[13px] pr-32">
                  <img
                    src={
                      'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/dem7enu9_expires_30_days.png'
                    }
                    className="h-[18px] w-3.5 object-fill"
                  />
                  <span className="text-[15px] font-bold text-white">
                    {'사내세미나'}
                  </span>
                </div>
              </div>
            </div>
            <div className="mb-3 flex items-start rounded-[10px] px-6 py-3">
              <div className="mr-[77px] flex shrink-0 items-center gap-2 pr-0.5">
                <img
                  src={
                    'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/v6qy7gyd_expires_30_days.png'
                  }
                  className="h-5 w-5 object-fill"
                />
                <span className="text-base font-bold text-white">
                  {'통합전자결재'}
                </span>
              </div>
              <img
                src={
                  'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/2mx3huio_expires_30_days.png'
                }
                className="h-6 w-6 rounded-[10px] object-fill"
              />
            </div>
            <div className="mb-52 flex items-start">
              <div className="mt-1 mr-[132px] flex shrink-0 items-center gap-2 pr-[3px]">
                <img
                  src={
                    'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/fsctonx7_expires_30_days.png'
                  }
                  className="h-5 w-5 object-fill"
                />
                <span className="text-base font-bold text-white">{'일정'}</span>
              </div>
              <img
                src={
                  'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/s3qan5ha_expires_30_days.png'
                }
                className="mt-1 mr-3 h-6 w-6 rounded-[10px] object-fill"
              />
              <img
                src={
                  'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/zi9rjn6a_expires_30_days.png'
                }
                className="h-[104px] w-3 rounded-xl object-fill"
              />
            </div>
            <div className="flex flex-col items-start gap-1.5 rounded-[10px]">
              <div className="mx-6 flex items-center gap-3 rounded py-2.5">
                <img
                  src={
                    'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/mdon1wx2_expires_30_days.png'
                  }
                  className="h-5 w-5 rounded object-fill"
                />
                <span className="text-[15px] font-bold text-white">
                  {'즐겨찾기'}
                </span>
              </div>
              <div className="mx-6 flex items-center gap-3 rounded py-2">
                <img
                  src={
                    'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/qekbjlyz_expires_30_days.png'
                  }
                  className="h-5 w-5 rounded object-fill"
                />
                <span className="text-[15px] font-bold text-white">
                  {'최근메뉴'}
                </span>
              </div>
              <div className="mx-6 flex items-center gap-3 rounded py-2">
                <img
                  src={
                    'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/v7bro0bb_expires_30_days.png'
                  }
                  className="h-5 w-5 rounded object-fill"
                />
                <span className="text-[15px] font-bold text-white">
                  {'IT업무별담당'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-2.5 flex items-center justify-between self-stretch">
              <div className="flex shrink-0 items-start gap-1.5 pr-1">
                <img
                  src={
                    'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/btdc79vh_expires_30_days.png'
                  }
                  className="h-8 w-8 object-fill"
                />
                <span className="text-2xl font-bold text-[#23252A]">
                  {'의견작성'}
                </span>
              </div>
              <div className="flex shrink-0 items-start gap-4">
                <div className="flex shrink-0 items-center pr-[3px]">
                  <span className="mr-2.5 text-sm font-bold text-[#5A6673]">
                    {'홈'}
                  </span>
                  <img
                    src={
                      'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/h4e5nlcx_expires_30_days.png'
                    }
                    className="mr-2 h-4 w-4 object-fill"
                  />
                  <span className="mr-2.5 text-sm font-bold text-[#5A6673]">
                    {'CEO소통방'}
                  </span>
                  <img
                    src={
                      'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/8j02v1d1_expires_30_days.png'
                    }
                    className="mr-2 h-4 w-4 object-fill"
                  />
                  <span className="text-sm font-bold text-[#5A6673]">
                    {'의견작성'}
                  </span>
                </div>
                <div className="flex shrink-0 items-start gap-2.5">
                  <img
                    src={
                      'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/1o4ilth8_expires_30_days.png'
                    }
                    className="h-5 w-5 object-fill"
                  />
                  <img
                    src={
                      'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/ibwqo7ua_expires_30_days.png'
                    }
                    className="h-5 w-5 object-fill"
                  />
                </div>
              </div>
            </div>
            <div className="mb-4 flex items-start justify-between self-stretch">
              <div className="mt-[126px] flex shrink-0 items-center gap-3">
                <div className="flex shrink-0 items-start gap-1.5">
                  <button
                    className="flex shrink-0 items-start gap-[43px] rounded border border-solid border-[#DADBE3] bg-white px-4 py-3 text-left"
                    onClick={() => alert('Pressed!')}
                  >
                    <span className="text-base font-bold text-[#23252A]">
                      {'전체'}
                    </span>
                    <img
                      src={
                        'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/rfv6bamm_expires_30_days.png'
                      }
                      className="h-6 w-6 rounded object-fill"
                    />
                  </button>
                  <button
                    className="flex shrink-0 items-start gap-12 rounded border border-solid border-[#DADBE3] bg-white px-4 py-3 text-left"
                    onClick={() => alert('Pressed!')}
                  >
                    <span className="text-base font-bold text-[#23252A]">
                      {'최신순'}
                    </span>
                    <img
                      src={
                        'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/bh99veg7_expires_30_days.png'
                      }
                      className="h-6 w-6 rounded object-fill"
                    />
                  </button>
                  <button
                    className="flex shrink-0 flex-col items-start rounded border border-solid border-[#9EA0A7E8] bg-white px-[22px] py-3 text-left"
                    onClick={() => alert('Pressed!')}
                  >
                    <span className="text-base font-bold text-[#23252A]">
                      {'기간검색'}
                    </span>
                  </button>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 pr-0.5">
                  <img
                    src={
                      'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/bdmc75zv_expires_30_days.png'
                    }
                    className="h-5 w-5 object-fill"
                  />
                  <span className="text-base font-bold text-[#5A6673]">
                    {'검색 초기화'}
                  </span>
                </div>
              </div>
              <div className="relative flex shrink-0 flex-col items-center">
                <div
                  className="flex flex-col items-start rounded-xl border border-solid border-[#DADBE3] bg-white py-3"
                  style={{
                    boxShadow: '0px 8px 16px #00000012',
                  }}
                >
                  <div className="mx-6 flex items-start py-4">
                    <span className="mr-[92px] text-base font-bold text-[#23252A]">
                      {'인쇄하기'}
                    </span>
                    <img
                      src={
                        'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/pmi5ihc2_expires_30_days.png'
                      }
                      className="h-6 w-6 object-fill"
                    />
                  </div>
                  <div className="mx-6 flex items-start gap-[46px] py-4">
                    <span className="text-base font-bold text-[#23252A]">
                      {'엑셀로 내보내기'}
                    </span>
                    <img
                      src={
                        'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/xa213lhf_expires_30_days.png'
                      }
                      className="h-6 w-6 object-fill"
                    />
                  </div>
                </div>
                <div className="absolute top-[22px] right-[200px] flex w-[800px] items-center justify-between rounded-xl border-[3px] border-solid border-[#2E73E3] bg-white px-8 py-1">
                  <div className="flex shrink-0 items-center gap-6 pr-0.5">
                    <div className="flex shrink-0 items-center gap-[35px]">
                      <span className="text-lg font-bold text-[#5A6673]">
                        {'전체'}
                      </span>
                      <img
                        src={
                          'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/wty6cdym_expires_30_days.png'
                        }
                        className="h-6 w-6 object-fill"
                      />
                    </div>
                    <div className="h-14 w-[1px] bg-[#DADBE3]"></div>
                    <span className="text-lg font-bold text-[#A3A7B1]">
                      {'검색어를 입력하세요'}
                    </span>
                  </div>
                  <img
                    src={
                      'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/l9vw3kwk_expires_30_days.png'
                    }
                    className="h-7 w-7 object-fill"
                  />
                </div>
                <img
                  src={
                    'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/1s320ddk_expires_30_days.png'
                  }
                  className="absolute bottom-[-38px] left-[5px] h-12 w-[95px] object-fill"
                />
                <div className="absolute right-[-10px] bottom-[-38px] flex w-[120px] flex-col rounded bg-[#2E73E3]">
                  <span className="mx-[39px] my-3 text-center text-base font-bold text-white">
                    {'글쓰기'}
                  </span>
                </div>
              </div>
            </div>
            <div
              className="mb-2.5 flex items-center justify-between self-stretch rounded-xl bg-white px-6 py-5"
              style={{
                boxShadow: '0px 8px 16px #2019AB0D',
              }}
            >
              <div className="flex shrink-0 flex-col items-center gap-1">
                <div className="flex items-center">
                  <div className="mr-2 flex shrink-0 flex-col items-start rounded bg-[#2E73E3] px-2 py-0.5">
                    <span className="text-sm font-bold text-white">
                      {'공지'}
                    </span>
                  </div>
                  <span className="mr-2.5 text-lg font-bold text-[#2E73E3]">
                    {'브랜드명을 변경합니다.'}
                  </span>
                  <img
                    src={
                      'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/3wsrh9d9_expires_30_days.png'
                    }
                    className="h-6 w-[52px] object-fill"
                  />
                </div>
                <div className="flex items-start gap-5">
                  <div className="flex shrink-0 items-center gap-[19px] pr-[3px]">
                    <span className="text-[15px] text-[#5A6673]">
                      {'김임원'}
                    </span>
                    <span className="text-[15px] text-[#5A6673]">
                      {'임원실'}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-start gap-1.5">
                    <div className="flex shrink-0 items-center">
                      <span className="mr-0.5 text-[15px] text-[#5A6673]">
                        {'조회수'}
                      </span>
                      <span className="mx-1 text-[15px] font-bold text-[#23252A]">
                        {'11'}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center">
                      <span className="mr-0.5 text-[15px] text-[#5A6673]">
                        {'댓글'}
                      </span>
                      <span className="mx-1.5 text-[15px] font-bold text-[#23252A]">
                        {'5'}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center">
                      <span className="mr-[1px] text-[15px] text-[#5A6673]">
                        {'공감'}
                      </span>
                      <span className="mx-[3px] text-[15px] font-bold text-[#23252A]">
                        {'12'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <input
                placeholder={'2024.11.05'}
                value={input1}
                onChange={(event) => onChangeInput1(event.target.value)}
                className="flex-1 self-stretch border-0 bg-transparent py-[15px] text-[15px] text-[#5A6673]"
              />
            </div>
            <div
              className="mb-2.5 flex items-center justify-between self-stretch rounded-xl bg-white px-6 py-5"
              style={{
                boxShadow: '0px 8px 16px #2019AB0D',
              }}
            >
              <div className="flex shrink-0 flex-col items-start gap-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg font-bold text-[#23252A]">
                    {'브랜드명을 변경합니다.'}
                  </span>
                  <img
                    src={
                      'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/isoftj9z_expires_30_days.png'
                    }
                    className="h-6 w-[52px] object-fill"
                  />
                </div>
                <div className="flex items-start gap-5">
                  <div className="flex shrink-0 items-center gap-[19px] pr-[3px]">
                    <span className="text-[15px] text-[#5A6673]">
                      {'김임원'}
                    </span>
                    <span className="text-[15px] text-[#5A6673]">
                      {'임원실'}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-start gap-1.5">
                    <div className="flex shrink-0 items-center">
                      <span className="mr-0.5 text-[15px] text-[#5A6673]">
                        {'조회수'}
                      </span>
                      <span className="mx-1 text-[15px] font-bold text-[#23252A]">
                        {'11'}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center">
                      <span className="mr-0.5 text-[15px] text-[#5A6673]">
                        {'댓글'}
                      </span>
                      <span className="mx-1.5 text-[15px] font-bold text-[#23252A]">
                        {'5'}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center">
                      <span className="mr-[1px] text-[15px] text-[#5A6673]">
                        {'공감'}
                      </span>
                      <span className="mx-[3px] text-[15px] font-bold text-[#23252A]">
                        {'12'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <input
                placeholder={'2024.11.05'}
                value={input2}
                onChange={(event) => onChangeInput2(event.target.value)}
                className="flex-1 self-stretch border-0 bg-transparent py-[15px] text-[15px] text-[#5A6673]"
              />
            </div>
            <div
              className="mb-2.5 flex items-center justify-between self-stretch rounded-xl bg-white px-6 py-5"
              style={{
                boxShadow: '0px 8px 16px #2019AB0D',
              }}
            >
              <div className="flex shrink-0 flex-col items-start gap-1">
                <div className="flex flex-col items-center pb-[1px]">
                  <span className="text-lg font-bold text-[#23252A]">
                    {'브랜드명을 변경합니다.'}
                  </span>
                </div>
                <div className="flex items-start gap-5">
                  <div className="flex shrink-0 items-center gap-[19px] pr-[3px]">
                    <span className="text-[15px] text-[#5A6673]">
                      {'김임원'}
                    </span>
                    <span className="text-[15px] text-[#5A6673]">
                      {'임원실'}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-start gap-1.5">
                    <div className="flex shrink-0 items-center">
                      <span className="mr-0.5 text-[15px] text-[#5A6673]">
                        {'조회수'}
                      </span>
                      <span className="mx-1 text-[15px] font-bold text-[#23252A]">
                        {'11'}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center">
                      <span className="mr-0.5 text-[15px] text-[#5A6673]">
                        {'댓글'}
                      </span>
                      <span className="mx-1.5 text-[15px] font-bold text-[#23252A]">
                        {'5'}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center">
                      <span className="mr-[1px] text-[15px] text-[#5A6673]">
                        {'공감'}
                      </span>
                      <span className="mx-[3px] text-[15px] font-bold text-[#23252A]">
                        {'12'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <input
                placeholder={'2024.11.05'}
                value={input3}
                onChange={(event) => onChangeInput3(event.target.value)}
                className="flex-1 self-stretch border-0 bg-transparent py-[15px] text-[15px] text-[#5A6673]"
              />
            </div>
            <div
              className="mb-2.5 flex items-center justify-between self-stretch rounded-xl bg-white px-6 py-5"
              style={{
                boxShadow: '0px 8px 16px #2019AB0D',
              }}
            >
              <div className="flex shrink-0 flex-col items-start gap-1">
                <div className="flex flex-col items-center pb-[1px]">
                  <span className="text-lg font-bold text-[#23252A]">
                    {'브랜드명을 변경합니다.'}
                  </span>
                </div>
                <div className="flex items-start gap-5">
                  <div className="flex shrink-0 items-center gap-[19px] pr-[3px]">
                    <span className="text-[15px] text-[#5A6673]">
                      {'김임원'}
                    </span>
                    <span className="text-[15px] text-[#5A6673]">
                      {'임원실'}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-start gap-1.5">
                    <div className="flex shrink-0 items-center">
                      <span className="mr-0.5 text-[15px] text-[#5A6673]">
                        {'조회수'}
                      </span>
                      <span className="mx-1 text-[15px] font-bold text-[#23252A]">
                        {'11'}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center">
                      <span className="mr-0.5 text-[15px] text-[#5A6673]">
                        {'댓글'}
                      </span>
                      <span className="mx-1.5 text-[15px] font-bold text-[#23252A]">
                        {'5'}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center">
                      <span className="mr-[1px] text-[15px] text-[#5A6673]">
                        {'공감'}
                      </span>
                      <span className="mx-[3px] text-[15px] font-bold text-[#23252A]">
                        {'12'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <input
                placeholder={'2024.11.05'}
                value={input4}
                onChange={(event) => onChangeInput4(event.target.value)}
                className="flex-1 self-stretch border-0 bg-transparent py-[15px] text-[15px] text-[#5A6673]"
              />
            </div>
            <div
              className="mb-2.5 flex items-center justify-between self-stretch rounded-xl bg-white px-6 py-5"
              style={{
                boxShadow: '0px 8px 16px #2019AB0D',
              }}
            >
              <div className="flex shrink-0 flex-col items-start gap-1">
                <div className="flex flex-col items-center pb-[1px]">
                  <span className="text-lg font-bold text-[#23252A]">
                    {'브랜드명을 변경합니다.'}
                  </span>
                </div>
                <div className="flex items-start gap-5">
                  <div className="flex shrink-0 items-center gap-[19px] pr-[3px]">
                    <span className="text-[15px] text-[#5A6673]">
                      {'김임원'}
                    </span>
                    <span className="text-[15px] text-[#5A6673]">
                      {'임원실'}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-start gap-1.5">
                    <div className="flex shrink-0 items-center">
                      <span className="mr-0.5 text-[15px] text-[#5A6673]">
                        {'조회수'}
                      </span>
                      <span className="mx-1 text-[15px] font-bold text-[#23252A]">
                        {'11'}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center">
                      <span className="mr-0.5 text-[15px] text-[#5A6673]">
                        {'댓글'}
                      </span>
                      <span className="mx-1.5 text-[15px] font-bold text-[#23252A]">
                        {'5'}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center">
                      <span className="mr-[1px] text-[15px] text-[#5A6673]">
                        {'공감'}
                      </span>
                      <span className="mx-[3px] text-[15px] font-bold text-[#23252A]">
                        {'12'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <input
                placeholder={'2024.11.05'}
                value={input5}
                onChange={(event) => onChangeInput5(event.target.value)}
                className="flex-1 self-stretch border-0 bg-transparent py-[15px] text-[15px] text-[#5A6673]"
              />
            </div>
            <div
              className="flex items-center justify-between self-stretch rounded-xl bg-white px-6 py-5"
              style={{
                boxShadow: '0px 8px 16px #2019AB0D',
              }}
            >
              <div className="flex shrink-0 flex-col items-start gap-1">
                <div className="flex flex-col items-center pb-[1px]">
                  <span className="text-lg font-bold text-[#23252A]">
                    {'브랜드명을 변경합니다.'}
                  </span>
                </div>
                <div className="flex items-start gap-5">
                  <div className="flex shrink-0 items-center gap-[19px] pr-[3px]">
                    <span className="text-[15px] text-[#5A6673]">
                      {'김임원'}
                    </span>
                    <span className="text-[15px] text-[#5A6673]">
                      {'임원실'}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-start gap-1.5">
                    <div className="flex shrink-0 items-center">
                      <span className="mr-0.5 text-[15px] text-[#5A6673]">
                        {'조회수'}
                      </span>
                      <span className="mx-1 text-[15px] font-bold text-[#23252A]">
                        {'11'}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center">
                      <span className="mr-0.5 text-[15px] text-[#5A6673]">
                        {'댓글'}
                      </span>
                      <span className="mx-1.5 text-[15px] font-bold text-[#23252A]">
                        {'5'}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center">
                      <span className="mr-[1px] text-[15px] text-[#5A6673]">
                        {'공감'}
                      </span>
                      <span className="mx-[3px] text-[15px] font-bold text-[#23252A]">
                        {'12'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <input
                placeholder={'2024.11.05'}
                value={input6}
                onChange={(event) => onChangeInput6(event.target.value)}
                className="flex-1 self-stretch border-0 bg-transparent py-[15px] text-[15px] text-[#5A6673]"
              />
            </div>
          </div>
        </div>
        <div
          className="mb-2.5 ml-[340px] flex items-center rounded-xl bg-white px-6 py-5"
          style={{
            boxShadow: '0px 8px 16px #2019AB0D',
          }}
        >
          <div className="mr-[817px] flex shrink-0 flex-col items-start gap-1">
            <div className="flex flex-col items-center pb-[1px]">
              <span className="text-lg font-bold text-[#23252A]">
                {'브랜드명을 변경합니다.'}
              </span>
            </div>
            <div className="flex items-start gap-5">
              <div className="flex shrink-0 items-center gap-[19px] pr-[3px]">
                <span className="text-[15px] text-[#5A6673]">{'김임원'}</span>
                <span className="text-[15px] text-[#5A6673]">{'임원실'}</span>
              </div>
              <div className="flex shrink-0 items-start gap-1.5">
                <div className="flex shrink-0 items-center">
                  <span className="mr-0.5 text-[15px] text-[#5A6673]">
                    {'조회수'}
                  </span>
                  <span className="mx-1 text-[15px] font-bold text-[#23252A]">
                    {'11'}
                  </span>
                </div>
                <div className="flex shrink-0 items-center">
                  <span className="mr-0.5 text-[15px] text-[#5A6673]">
                    {'댓글'}
                  </span>
                  <span className="mx-1.5 text-[15px] font-bold text-[#23252A]">
                    {'5'}
                  </span>
                </div>
                <div className="flex shrink-0 items-center">
                  <span className="mr-[1px] text-[15px] text-[#5A6673]">
                    {'공감'}
                  </span>
                  <span className="mx-[3px] text-[15px] font-bold text-[#23252A]">
                    {'12'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <input
            placeholder={'2024.11.05'}
            value={input7}
            onChange={(event) => onChangeInput7(event.target.value)}
            className="w-[69px] border-0 bg-transparent py-[15px] text-[15px] text-[#5A6673]"
          />
        </div>
        <div className="relative mr-10 mb-16 ml-[340px] flex flex-col self-stretch">
          <div
            className="flex items-center justify-between self-stretch rounded-xl bg-white px-6 py-5"
            style={{
              boxShadow: '0px 8px 16px #2019AB0D',
            }}
          >
            <div className="flex shrink-0 flex-col items-start gap-1">
              <div className="flex flex-col items-center pb-[1px]">
                <span className="text-lg font-bold text-[#23252A]">
                  {'브랜드명을 변경합니다.'}
                </span>
              </div>
              <div className="flex items-start gap-5">
                <div className="flex shrink-0 items-center gap-[19px] pr-[3px]">
                  <span className="text-[15px] text-[#5A6673]">{'김임원'}</span>
                  <span className="text-[15px] text-[#5A6673]">{'임원실'}</span>
                </div>
                <div className="flex shrink-0 items-start gap-1.5">
                  <div className="flex shrink-0 items-center">
                    <span className="mr-0.5 text-[15px] text-[#5A6673]">
                      {'조회수'}
                    </span>
                    <span className="mx-1 text-[15px] font-bold text-[#23252A]">
                      {'11'}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center">
                    <span className="mr-0.5 text-[15px] text-[#5A6673]">
                      {'댓글'}
                    </span>
                    <span className="mx-1.5 text-[15px] font-bold text-[#23252A]">
                      {'5'}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center">
                    <span className="mr-[1px] text-[15px] text-[#5A6673]">
                      {'공감'}
                    </span>
                    <span className="mx-[3px] text-[15px] font-bold text-[#23252A]">
                      {'12'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <input
              placeholder={'2024.11.05'}
              value={input8}
              onChange={(event) => onChangeInput8(event.target.value)}
              className="flex-1 self-stretch border-0 bg-transparent py-[15px] text-[15px] text-[#5A6673]"
            />
          </div>
          <button
            className="absolute right-[524px] bottom-[-24px] left-[524px] flex items-center self-stretch rounded border-0 bg-[#7C8089] px-5 py-3 text-left"
            style={{
              boxShadow: '0px 8px 16px #2019AB0D',
            }}
            onClick={() => alert('Pressed!')}
          >
            <img
              src={
                'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/yZKa8lfWSg/k1ti4nsd_expires_30_days.png'
              }
              className="mr-1.5 h-6 w-6 object-fill"
            />
            <span className="flex-1 text-base font-bold text-white">
              {'더보기'}
            </span>
            <span className="mr-1.5 text-base font-bold text-white">{'8'}</span>
            <span className="mr-[5px] text-base font-bold text-[#BBBBBB]">
              {'/'}
            </span>
            <span className="text-base font-bold text-[#BBBBBB]">{'25'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
