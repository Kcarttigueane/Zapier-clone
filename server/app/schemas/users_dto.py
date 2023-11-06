from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field

from app.schemas.mongoModel import MongoModel
from app.schemas.py_object_id import PyObjectId

DEFAULT_PROFILE_PICTURE = "data:image/png;base64,UklGRvofAABXRUJQVlA4TO0fAAAvf8KfAFXp0f7/lRvZ2f9GrkwDIEgW2H0b6O5xT5Pdjdu8PeRtN40GbzcLoEF1L2L8DHn+9YMMEMgh+FeAcEomvf7eMUdetYLeAFdQgbw06XXxkW8Ev6BuKO+l0HuzCwYnQCKDhPLSBrw5ciE7leEKjrzGMO0NdCqDX8C0AjnKxAqvG9MpkmsYHIZyDCAvMZSrFDIpkjE9BhtAUPIS5ZlwA/LSCcBAphDIIfjLqzcwCJgykKsAqRzkwYAbYMkXgwl5HQMGTDrsE5S8mDIYBkzl/XVjKK/u55m/vO0NcORtJQxKLmRwveEGjry0AW+YQGYMgpMgnVTeexe7CRi2bRtm/z+8Ro4VBG3bZkl6/pDf/wmokQb/N/i/wf8N/m/wf4P/G/zf4P8G/zf4v8H/Df5v8H+D/xv83+D/Bv83+L/B/w3Krllmy2072+rLCCEE57XeHJnrzZP5Uid1x2jdx60eHTXmH4W5YlmcCyFE/RUhagq3CkbgLvAR8OZ7yZrjQq0u5+rZ5axlps5Yz6jT19PXxjPWm9eZ65n17OXc5fxygfLk3KPOCxza6Picw+JCPKGeiRDcKhjainmev2w7q55ep8YT09NnU6ZJrJQmsGIqoqJZ8SseL57C4Xg8PpYoZiVUyiYPZen48YR0s/gM65l7VWV2ScbUfMHiQtQTEYJbMS0gyVnH5ZV4UncsTmRuEQuXvCZM5iRyfIQ4hW5zX0J0HLN0csNjJcwMnYjT1pnr+bXmNFTD4kLU9xB+sXZf5AX87YOV64kxNIGKqHjmTpom8dC2bRtv97Zt24jO4lTxy/WNFXHdzxXz71TD4qL+huBW/iKpPQYr1+2Tp0x4jYMh28Y71Clo2+gMpxLpclr3c/1H10X+Ahc76mEIPs8/0jVbP/hNY9mYGVjsoG3jHX7ILiPfy0wlJmY3wpuvF6jRV+CifoWQlhHwrup4xfSA66DdiXe8vs0mxy1+TUiP6K8+jRGrXdSbEDymzemdud6IzHiTQzbe8duE5oBbETu8gGfM8ftLvQhpjRi3kJPRNw24PiIbF5RlaKMZT984Xr4oO+dD+rWew1FZ6DoyYy0fM65DhAtWoskzN/E3+kVfgct6DPJoIXtB7zTEsIk2LohDNOmVSN9sraoxg8t6CvLoPBmpLgejRTyHluACmyZTqoS2n1PnfRhc1kM4Ko2u85cbb67bTbhgJyx9ZSriz50vdR81h6xvIAsBr6pscV0kXPCTL5lF9O/O2hs3/HK0PoFcpM06bxIzLhIuHJeQmShPg1pB1huQtZL1H9Ni1EXChacvUWPmylmiLfJL/QBZJ7kDS1s8woUroVuSpq6yT5fwJ5dlz5XjMO4QLnzJSxzabMw7JPTpffJZMibhwpmccEWqLmrtISFP5owZy9KSyZckLrRpwix6yrrI8AvcyYBcWLcfQw7hwpy88JR0C7vYXysS5uRQ14w6aSghwoU9TZzaTsPIfE9CnBxt31TELiFc+PuSN3Y8VVdVhzddPbt+pjZCZUjD0elr15BfYE0O1elpa2YiESpF8uI3TrVnTEKaNNpP2IomD5Ukpaak81WrFTjTL7qrWnyTS6gsyYxek9UljLXr2Wfc3F5CpelLXuLk9XsM+QXC5JAxLSY8X0IFSmPba4/dfoEv2ZO8EY4RKlNqOxaf+RqV0CWN2eW4rI1QqdLi9Hm9LglbsvmLHlpDqFypNzVzCXxJyJLapeZhQiVLkyl8xtqqw5W86Fg/AXsJFa6X6M/qUCXVmXq950uoeL2xPZoOU35RNw94qITL6KOcvHXpECVf+5qEh8qYjmFTY0B1eJKt/yTjoVKm+Lrs24Qm2fpMlvFQOVN8TxaYZNfl13uopCdvY6euV0hIkvnzcq6HypqKpgOqhCNp7CtNvb6ksNBLnJnL+gWKZI+/LBkmHyluz700L2Ho6FByfwkjVN6+1PuvZpXdfgEhva7/FVOESpyGyyZ/mScSgGR2a4J8pMypqTxFdPiRrZclCJU6DTw+K6FH1klVdT1U7nRDhyphRxaOdpuk4NBzz6uGBB19/l1FcgmVPPV+Jn9ZJgFHqnvGyEfKntzthg43cnRvxkOlT8ew/os9CTXtQ+2fqdeXFB96bbcwwy9Aowdkg0uo/OnwyxwZghmpNsYJWZDabrJqEmKOFmbpBPKQDSnxbZolwOhGRVpDjIDpQzXeELzIvsY4IStSalOfhJb2wgWe6SE7UuIn5iWw6Mb2NcQQmP5MNUcSVqR22RghS1LLI7MSVKytkzIH2XIyc6tKnV8Cimxd3kKM4UvD5Wm+6nBy9CWucz1kTYpfpvkFTN5mnVRspS9iDnQestWCEjl65yIiZE8KT91UCST6oinpMLKoF33hAozIvukaJyYh92BWgoh1pNtBNu12t72EBBCpVq5hYhRyNwTkLwGI5S9px0esSpkHGBI8pHpKDBO7NJ4QYxw8rbUTMwfZlTKDhgQOqcbDxDLuhi7osOb0uh1kWvdOLyFBQwaO6Wvxi5iG3JukLGxYc45OBxk3eo8CZIj8nceIcSg1NaoSMLhREUtpCeOgc4hbcOEvLzHg+oh5KX7GXrO/gIXsu1mWCjEPmvvn3XGwtHalHWTfJS17DX8BCtQOxImByL0xNkug4JH9JjKxeWEpwMSuD3deLZkhE1O8sVmAhFSXp0JM5EtmefweHCSt2gsdZGT3uoK/AoQYvTxBjBRK7VH9AhCy+cbk2oyEjr6o5gMgrLW9DjJz5gGGAAcx+qXGiJns1LSo+gs4yJGDrs1MaB6bchwcrdqj20GGdrf1+AswCOOcspMYyg5Xrho0oHrymupkKF8yy8f5HgfG77BId5Cpo7POAix8zEJ1KSFk6lDxa8Za9yFAQeSna9xmKts9OOIvoHC0+VEuW6FjJ18cFKwj6CBju9sKTwAEEVn56ZCx7Xhjs4AErT9ss5Z70i7gtQMCX3EjaGItdEJJCxCsZMhB5o7eo7ADDgr3iCJzh+IzdVSAgRileIi57NRyFRDUaTFlM1dZLKWKZHA4NLrMv8xc6ByqOSwwsLY+xEEGd6tKjwCCHYXqshgZ3I7PqHkoEKPfeCzEYqk9Khho/WGbxdZsWcGhIHuTrYRYDHtX56CAj5ePJrK4k95lAYH16Ic4TIZNiR4BA7l9UWRye+zbjMKA2D2YYbTwgWYgGL1z3Gaz1NSoAoHWH2a0pm/QvAMG1Lun2Eya5TjOYTAgG9awGTqhpAUD4//ORDb/l2kBA7WyaMroMBpG9xVAwPpRh5itKdEjQGB2SfsmRuvc+X0NECjsiyKj2/Ez90YhQPQMNLFbR90HCMT2tvxlVgtXrhoIjH6eMZvVUutUGLhz8YvdTt5gIH8Nu7XdbAcEZ1SGO9gKA41hZnM3ZUGg+QDDvfYICGj97LbmRtuKHSBQuTLcX1/BQeAZIsNtgYHmA+zW9KgRAQH5RnZzN2VhoKP4xWxtB1th4DKGexYVBOqOf8JwdweCbzPGbKnlMGB8352drNZSuWog0JNoQlYLN+YhgBfuEWW24tedR0Fg0VX/itmKaL0BAlbNcchhNPx0KyMwkAwx2+LqUtgBAXzZ/lLGauaFkuQgWHd3YozabOZ01x4WCAj1WdoYbdXxGOEwoFWuLWxmr9nQBQT5a4pfjNb2eFXAQGzvzhCbhfs1GNhRcBcjm8Vn1FEY4NbaiclhMswMRoCA5/YfZjPzqiSHQX9pflQJ2SzmTEnJrUAgtHeZYjE7+oq/lUPBKMWZLLVcFVDQcycXWSx+8yUPBdxa2+swGGYGI2DAx+9jMpiT3mVxKBTqE9ts9jLvE+FwkN8cZy+77ZGqgIOebS6yV3xzHg649Wjf5DAXulXaAwg8tnE4xFpO91aLw6HQ9rSwVmh4e4xDgvF9W8qIsexw5aoJQODWX1rqMBZmVu4GBV53bl/cyVYOHrE4JAqtP8xWtvufmtthIbLy0yFbFb8amwUocOtIt8NU6G4rfExY8Et+k2uzlLk6x4FR5M/cGyOGslPrVH8BBm5h2mEozAzGBDTwrg2uzU7OyyQtDo0ivzlOzGS3PUurv4ADL1xr+oiZKXG5IeCBx7aXvkKs5HQ/2uLwKPKXxYmR7NTjVQkQ3PKXTzQpMRJmBg0BETK7yf0bbGSuznGQFMb6BDFRZ/i0RZUgweeUZMhhImy6R2EHTEj1lNhCDESNG2McKgv7oshCRezMmBdQwbu2uMQ+TihpcagUxvoW9qHwUzV/AQvOc69uMs9bXXWBFjhcSm36GifGIXdTswQMbh095LBO5txq+AtkSHVPmJiGzI0Gh8034U3EycQ2O9cbEjakujxFDONLZvlY5+fQWbigF32rDEMDz2v4BTpk9qBL7GIeF+fp2+TgWdgX9ZiFBmaqIeFD9j2+rYxYxbxPpFY4gOauMj1GoZb1hoQQqe4JE5NQ6Wv7b+UwavGlDpP42PUrDQkjUusfIwYh91HNkgOpXjgWVzGIVzp74QKHUmmcXXYSc1DiXaoSTHh715UusUZvKGlxQC288ITkMQYlfmLdh4QUqZ66JYgpqOkVA34Oq/q8/h91mCm86KxSABZpXJrxGIKO4R1QJbBw2fd5w8QMNFyexnUOrlbS7mUGbwJV1x4JL7JO9oY9RqCxflVygJV9U+MAMQGVpBeK6Bxk9dz+YWIBb9UL90iYkeP3iHoMQIl/okkOtLK1Y4wUH7XcdMtKDra1S9eVbaTwyJySkkkOuENHQiYpO69t224JOXL3tqin6CjxR/skB12ZvXOCFByNLc9KDryyddoWJ8VGbkUyaoWDr268oksKjczu9oKEHzmkT5kWkzKbyItu2y05AMvItZOHw6TEvMzP1SQHYTlaVaP7FBglLrnYkxyIZfbnZjzFRfFTW6vkYCyvuCTxMgqLEs9yUU/ngCz7+sc+sqKixJWGzkF5bfZdxj+ygqLwjTAyxKE5uydOiolaToyRIQ7ObzO77hhGComuPwFzQxyg9YAs/yikiChckXJD7RDFde00HPMUEIVPzHJDRzlM61f0JzzFQzdsqitDkkO13tcR9nxJ2dADHr9Cb+dw7ZeL/TPXll5SMt4NiwKic9CW6mB6mBQL9Wamr1mdA7ccfeEpySWFQuaEvPWq5OAtd9fKxgQpEnLLxiZNcgCXQ5EnfhRPgVARKycZkxzEpZ7tcFeRwiAvsTWyTHIo16+oqqE2UhQ0/AtntKwuOZzL2Jzelgd4pBwovHqWdEkO6nKo7ux3TVIINGlKXD3n2C05tOtqla5OlIEiIHdi9sGzScnhXRrz5PNmemmhR94DTtzNLl2Sg7x8Wt/3/Q47JxMt3MidkDq6lkkO9TJfW+5+vUkLMbok0fzCms4BX1qt59Xjx2OYRwsp8nZ+ppnaVZAc9qUROWCmsIwWRjTcdvJWc4xsPcqhX+rqhb2f2VaSRwsdMhPlW9Ve3yLJ6wPKQr5q+bsJkxYq5BRNx+LvNL6H5PUF5bwv4xuvfsAltNAgJ/yQZwyFuuNtSl5/UG41cmfUKekBh2mhQE546WnL0cBZK5LXL5R64K5w2bEUN4kWdOSEH1K5ru2yJK9/KK18YUbdnyh9YWgBRmiGfVP/VtWSvH6i1PO5y1/RTTnkSwsm6nYz99lsa5ZfeP1F+TaNruoyNR7KmNi5wJlCaBaxUtx07hrJW5LXbxS8oP2l91GOJbTT8aW/sQCxyXEzv+ypL5yt83N/4fUfj/rFGjHO1z3HYsZ1fGQvEGxy3IGHPHEwpxXkLl5PUvCCOq/sfZaXyew00bbvqDptdFKJpY/6NnN6fQb3F16f0l9lzYehJQen1eOYO1DCHB/Z9h1FyEZneCDT+cTL+WjekoLXuxTSiqmR6nJgAxbzwiXkYMi274BCto3OcMv1n2jjU8+rSc2w2gWvpykELzR3HakqB7aUjdGBVJODaNv2ktuPbdshdIZTxS/30MZTde9aQ9ttScHrdX5Mwa3x5hVPmyVn1ne54detysRTruk4iJ327RDR93JMNxXfGe3eOC3OqNtqjphmWFwIXh9UCG4VDK1r0Z8b7D4t3mStSNS7yt0ZD4dTqVRbm9vWlkqlWsLxImqKpidn5eON6ZR4yTllX+0RU+s+eiwuBK9PukMIPscbiuS1rJFc+8J32jtTp6+V62m4bmp84sFNBx+5dd2eSjzQvb6q7BNPGx9R88Y8sbgQgtdPFUIIrlvLemKjeU1TVbU126qqqqbl80ZPwbL4bBVC8Pqw4nbL3/h2xW14G9Qc+hHLso7o+m3wBHHrd9QPEbeSc24lCz27jdF8s6aq2YDEjPHx+ZLLFZLJub0jn/LIqyXnHB8sl5t7jY/3GLubW1VNy4+OxsYLQ5bFubiV9TCEEIJza6gnNtqsqV3jc/XRn+seVXVwPW0+cGqdFp9l04nZxor0iPLxPsdlq4/FKSn0HXzToe7JWejX/ajVb/P48T7lqWLsesErb7pOjXv6O2bUs9a952l1eeG1yfkllg18aHUfdTJesCwuhBBPqP8ghBCcW4XdeU2L5WqOC3TbXjq97nmWDeVJP2RGSyhTRMWveLgl1eZOmIZN01x1uDft3PpJU7r3sGmaw4ub2lKpcDw+1tK0eNV7Dx0/bN+0vP+yn7tyn78kx7Nqvk4KlsWFEKJeghACudVjaH2x3NZ95y4z1sr1WV5w9aFV7s7iVzjVtsa8xPERItq3vixb4kt4u5RLQp32rf3LiOg45rCbCscTTdF06BHv85TYsX6bSPZk1XxkzlHzxYUQ9QZ2CMG51ZPXRnL+c9vzVq5Xv+DqpdHri18t7uK0g9hp37Jvwzta+1Yi/kvHdFPxhJsOVYybTombBz9XMhb4yMeGLC6EgL0dQnCrYKgByflLVbnzaXjl/smjW8TC7uK04yNp23YnLlilbds2+l6O6abimVWdL/jBO/Z+oqSh5iMWF0JA3A4huDVPDDVWe1SXM/f2bFidboqnSmiVg7Ztd+KCfYlt24jO4lQ8vOplKtIjO1b6S6QvH7G4EALQhMCaj8KoGjtSXegHbffR4oHUml4HbdvGhWmnbS9BZ7gtnkkfD8/yPi71l0hfPmJxIQBMCG715EeS97jztHW7b/oW4dRix0ch28aFdci20TFLKJ5Jv6erG1du/a2aYXEhAEsIbu3WAnKkqk7XTXo0nhp2MGR3ogK0bXRKyY1nDm18l+csYlw1ctzvCYDaIdqtmBbjg/0b0I27DobsECpK20ZnuGVnujx93ue99t9pdbKMCwFJwi+8kA/cPfpcOQ0q0tJMuMlB20ZlGuosoz9qporYqv1PnKnXGlrMahc7IGi2Cm4Z2jzvmXsd/6k7s3PYQdtGZbvWLiM03bD5iOccfHRzvsClgJ1du3ihL+Df9XlO3la7cddBuxMVsk1o7sx0X9nxAXOaYUkBNUJ+hw+nRq7rPwHTRZQy0bZRWS+x0XHj7qt/8JeY08vmLS7gRUjL0JIr97y6OzDskI3K3LbRTCW6P+GZe/4SkJFlXECKkJaRPXJOmRo7MztNH3V2oqK3yXEH0lsuuypQRgpcwMguf7GMbPs3/ko+akldgjayoE2OGzb/buNXN0bm3nEBHoJ/DzW5/uChAdfxJRvZ0SYcjkcrYsfsEvAMyy8CMAQvaJGq8nlDReQ6ZCNrhkJoxs0tM92j+4zv4C8IEkJaI8a+ynV/ps0h20dsSoRu+CHPsjep9nABDru40Te7dlTE6ICJNrIskeNer/+gbUbekv4CCEJaI5HBq9M3DPuoE9n3b/iSs9OtGK+pObR5H1wAwS5u9PnLdD1+zLiHKOQjRu7E0le4e2rcZoxYfvGX4J+0RiKXPkv6hlLyUSeyNJGz061IM2rNofVwEdTzF1nQZMd9Mu5S8hF7d2Jj2Dctvy4gBveXoB3yl8jO0mlxEmZMH4WQzYmclPuK6yN5SwblZK2XN1a+z2jKIWT5EDYm9m+e26+9CdkebJNWNve8FSnjIiHrE5lhjHtagftLME1agY9Hd6xOmD4iDAqSUzym715dAvISXATLpHWxf9dzPqT4ZdISDBrSZEqV0IZLuwy+KxgmLXXXnnTYIQwuErqZE7NLv6jBZbBLvonXFnvSGYcw+EjoZl7xvL2YwWUwS76J155d1v2r6x3C4CShm9k+GDO4DFZJ67WvWmemHMLgJfmSm9n4gJjhl28TjJK10uc/1pkphzC4Sb7kZravDNwV/BJ0kno+eWBp+BBh8JPILeZtmqXanEMGlSQ3Yv9kSrrBIQyOErrRz7u2r/aQwSP5El17y8eBiTPC4ClNppb33v9qzbUig0My2VddNoQbCYOrtHTsZa6JGDIIJPWsvzyxhJqIfBR0pUvCx6W92YIM9khjvGNpyiMMypKZOTi7aLoM5shkduV94g5hsJa63Yl4es0ZMmgj9T5/uVmXMclHwVxamtk/mC3I4IyMRc6oS9smE2GQl8z4VxKaLoMv0tKqevm4Qxj8XdLtpqev4z0y2CKND/aDijOTMDhMh47hvVB1VXUZTJGWeukvC3uEQWMajvZHxmXwRBqL1v1dkzCYTF78PtepugyOSKt18FgMe76EQWYadivXyG6/BEOk8WrLM6sIg8/kjX3fbZougx1Sv9j/B+ywh8FpMt2nRgoyuCEL88+Pev0qwmA1ecWv8u1aTQYz5MiFXkWKe76EQWxyJw0zNbvIL8EKuSj7O9MlrIwwuE2TZolHJmMyOCFji56YmDQRBr1p4Jddp+rBCF2tLqsHCIPhZDad3gIyV2SwQS4KeB0lZBIGx8l7wI3g0TEZXJA9uavHPMKgObWFqkufDCbIumN2uU+GMJhOE8foTMnq7UED+drvNx0lDK7TZEqsM4ZkcEAmu07XTC9h0N274YSs3ZDBANmTOxj3MBhPJVQ2bstK9pPGVfszhMF56m2asfbprCf7qurSCRNhsJ68xHN2zSmS6aR6+QTqJQzi0wOujgxJhtOz0zUzcUcY1KcitvFp45LVZK12TWsJD4P91LZ6djEkm8llkU1jhMF/in6m81WTLCYjRyriACEEUimLrm+V7CUjYkpyCWGQJr8yM4oqWUsa136HNYRgOJnCHa21wlbSuKDXvZgQEL3EgVadpWTdxz2WTnwSgqJ3Q+V2hc5Osnlb+jAhMHpj7zKrs5LUqkop9RKCoxde16WzkewajPYSAiQdw6bGLp2FZPM/nfDqJQRJWnn3gOrsI0e3rer1JQRK+ig/KLuWdfxi7Ev3liGCJY1VrldItpGRaw+ZhIBJNzSqkmXkuL+8zGLyEWwW0WWqZBfZ8+gpKUoInF7md7ZKVpFDye/rEoKn567vkoxSK7s3thEC6OYDVTUmmUTPPkuYEELp8ENmlx7JIFLtL34Rwiit2Z8camcOqf3OxGRCKKXUlrzOGjI2sMZDOKWx5VnJFrLnqqWHCVCQxhpfW7LE0aFXO45FCUHVy5y9dkmG0EdvBClCYN1szioRyQxSrVxXEkIrDa+eq7UfrCBH32/GQ3il8ME+v7GBLPjL0l4CGKSxDlUygW5UpCZCkPXcOxmSAWTrnuIXIcySGTqyTCo+qV1exMoAoZbatgREV3oyd2FvIm5GuKV4f6tUeLpRkVwCHPTcqvoHpaKTraevcULIJXN1TldysuceE8hD2KXwKVGVCk6P3GeYgAe9zKWGVGzytSvX4hch9PpS799IWkrNL7FtrofwS5mtfVKh6bm3aRIA4UfOnFMMqcikesouTAjCvS9zxFJi7YXqUkIewjCF16lSgdV6o9snzAiI0CvJqkuhXXHJ0ZmaKCOEYlqzffRtKi7riI/1IhxT4s55qbCk+oPCBEiYxiOWsmovuFs8hGQKr9Okoqo5jO1rCJTQK6Hq0nNUQUnjmZYEISzTmu0xrqD13GoToZmK2HpDKibZfPM1TuDkS2Z5mq9vUzFZyc40wjMlzqx14heFJLXGOAEUmsdl8/26QrIe3e0gRFP8j+alIpKtlWuYQAoPT0lv4lMqIstf3p3jI5im4tf70KQCkuqpIUxAhc7LPM1SQNbWQw5CNcU356XikVpjnMAKzf25rYqnVj7YjyrlIVxT4uca/qJwpPGlBgiySl/bR9cqHG5UjOYSwMKXaasqL+EvisbfMwYz5CPIphL63FmpaI42X+nCFvrG/3NBr6BoCveY8ELgppYfFPiQCkaqe1pCwIUOHrEUzC9LdjoI3TTwvKNCsQhjfQvBl3sjCnhcscrmTS58IZrXFhSLJdIPQfim8OmrJhTKrnxHnAAMzeOnCFeqH648mb4EYVgyS8y/26VI/LWwzUUQD6WmRtUviuQtqHtabBBD52VezVIkPHL8aCKQZ86VOhEKZEfhHosRyO3UOtVfFIhonr7EQ0CG5nEsx5VobHsjmKF7/ln4mMrjTcwuaQTzULhfE4pD5O8cJzgb7jK44pQjm1wbzBDNawuKw3p0t4NwTvHL8kJhiMilGQR02z3Y5y9Ko/lA2AY0/N+rc1xhtq/4Bi6oYfSrFxSG9WohByE9FJ+po0JRPKHw9lwEdTu1VVUWIr85boMamk+fjXNF6S99B11gw7Q351AUPLe6lCGsl1HLekMoiWUX1GEEdjv8VE1JiNh/2xmCNvfKFUeVRH76GraBDQ+/zRxXEuoT28DNmcj8xVIQ3OgyQ9CGblXtEcrBerXv4CC02/E75xXEsq++CuEt9d9V5SCM/7aT4K3pP61oVw75xrANbnj41XNcOagnQwrgnN61lmLYseI/rQE4jO7LKQY+Xp5M3wZwn+68GhGKYa5OSZcgvNs3XD6qGKya45ADcfGOvGIY+kSrEOJSz6kpBdEz4EJcKPVEVTHUyX9zdRvcQ8eS+Z8CwpXCaOPT/blj8B5+Qy9fyikFblWXGfUbPy/Av9OzepZi4Ln5H8YoxEe2KgcugJ43+L/B/w3+b/B/g/8b/N/g/wb/NygbAA=="


class UserRole(str, Enum):
    USER = "USER"
    ADMIN = "ADMIN"


class UserProfileDTO(BaseModel):
    first_name: Optional[str] = Field(
        None, title="First Name", description="The first name of the user."
    )
    last_name: Optional[str] = Field(
        None, title="Last Name", description="The last name of the user."
    )
    profile_picture: Optional[str] = Field(
        DEFAULT_PROFILE_PICTURE,
        title="Profile Picture",
        description="The profile picture encoded in base64",
    )
    language: str = Field(
        "English", title="Language", description="The preferred language of the user."
    )
    theme: str = Field(
        "light", title="Theme", description="The UI theme preference of the user."
    )

    class Config:
        schema_extra = {
            "example": {
                "first_name": "John",
                "last_name": "Doe",
                "language": "English",
                "theme": "light",
            }
        }


class UserOAuthDTO(BaseModel):
    provider: str = Field(
        ...,
        title="Provider",
        description="The OAuth provider (e.g., Google, Facebook).",
    )
    provider_user_id: str = Field(
        ...,
        title="Provider User ID",
        description="The user ID according to the OAuth provider.",
    )
    service_name: str | None = Field(
        None,
        title="Service Name",
        description="The name of the service this OAuth data is associated \
        with (e.g., youtube, calendar).",
    )
    access_token: str = Field(
        ...,
        title="Access Token",
        description="The access token obtained from the OAuth provider.",
    )
    refresh_token: Optional[str] = Field(
        None,
        title="Refresh Token",
        description="The refresh token obtained from the OAuth provider (if provided).",
    )
    created_at: datetime = Field(
        default=datetime.now(),
        title="Creation Date",
        description="The date and time when the OAuth data was created.",
    )
    updated_at: datetime = Field(
        default=datetime.now(),
        title="Update Date",
        description="The date and time when the OAuth data was last updated.",
    )

    class Config:
        model_json_schema = {
            "example": {
                "provider": "Google",
                "provider_user_id": "provideruserid",
                "created_at": "2023-09-25T18:44:52Z",
                "updated_at": "2023-09-25T18:44:52Z",
            }
        }


class UserInDTO(MongoModel):
    email: EmailStr = Field(
        ..., title="Email", description="The email address of the user."
    )
    password: str | None = Field(
        None,
        title="Password",
        description="The password of the user. This field is write-only.",
    )
    recovery_code: str | None = Field(
        None,
        title="Recovery Code",
        description="The recovery code of the user. For reset password",
    )
    status: str = Field(
        default="active",
        title="Status",
        description="Account status of the user(e.g., active, inactive, suspended).",
    )
    role: UserRole = Field(
        default=UserRole.USER,
        title="Role",
        description="The role of the user (e.g., user, admin).",
    )
    email_verified: bool = Field(
        default=False,
        title="Email Verified",
        description="Indicator if the user's email is verified.",
    )
    profile: UserProfileDTO = Field(
        ...,
        title="Profile",
        description="The user's profile containing personal information.",
    )
    oauth: List[UserOAuthDTO] = Field(
        default=[],
        title="OAuth Data",
        description="A list of OAuth data associated with the user.",
    )
    created_at: datetime = Field(
        default=datetime.now(),
        title="Creation Date",
        description="The date and time when the user account was created.",
    )
    updated_at: datetime = Field(
        default=datetime.now(),
        title="Update Date",
        description="The date and time when the user account was last updated.",
    )

    class Config:
        model_json_schema = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "email": "john.doe@example.com",
                "password": "password",
                "recovery_code": "code",
                "status": "active",
                "email_verified": True,
                "profile": {
                    "first_name": "John",
                    "last_name": "Doe",
                    "language": "English",
                    "theme": "dark",
                },
                "oauth": [
                    {
                        "provider": "Google",
                        "provider_user_id": "provideruserid",
                        "created_at": "2023-09-25T18:44:52Z",
                        "updated_at": "2023-09-25T18:44:52Z",
                    }
                ],
                "created_at": "2023-09-25T18:44:52Z",
                "updated_at": "2023-09-25T18:44:52Z",
            }
        }


class UserOutDTO(UserInDTO):
    id: PyObjectId = Field(
        ..., title="User ID", description="The unique identifier of the user."
    )


class UserOutDTOWithoutOAuth(UserOutDTO):
    oauth: List[UserOAuthDTO] = []
