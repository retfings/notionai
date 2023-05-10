import pandas as pd

# 读取第一个Excel文件
df1 = pd.read_excel('Wikiaitools(1).xlsx')

# 读取第二个Excel文件
df2 = pd.read_excel('Wikiaitools(2).xlsx')

# 将两个DataFrame对象合并为一个
merged_df = pd.concat([df1, df2], ignore_index=True)

# 将合并后的数据保存到新的Excel文件中
filename = 'all.xlsx'
merged_df.to_excel(filename, index=False)
